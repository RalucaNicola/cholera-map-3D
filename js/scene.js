define([
  "esri/WebScene",
  "esri/Color",
  "esri/views/SceneView",
  "esri/Graphic",
  "esri/layers/support/LabelClass",
  "esri/geometry",
  "./font",
  "./fontmesh"
], function (WebScene, Color, SceneView, Graphic, LabelClass, geometry, font, fontmesh) {

  function create() {

    const map = new WebScene({
      portalItem: {
        id: "2535399d4a6040fd8c60c46d57209548"
      }
    });

    const view = new SceneView({
      container: "viewDiv",
      map: map,
      qualityProfile: "high"
    });
    view.highlightOptions.color = new Color("#b5b5b5");

    let pumpsLayer = null;
    let deathsLayer = null;

    map.when(function() {
      pumpsLayer = map.layers.find(function(layer) {
        return layer.title === "Pumps";
      });
      pumpsLayer.renderer = {
        type: "simple",
        field: "FID",
        symbol: {
          type: "point-3d",
          symbolLayers: [{
            type: "object",
            resource: {
              primitive: "cylinder"
            },
            material: {
              color: [110, 146, 181, 1]
            },
            depth: 10,
            height: 5,
            width: 10
          }]
        }
      };
      pumpsLayer.labelingInfo = [
        new LabelClass({
          labelExpressionInfo: {expression: "$feature.Name"},
          symbol: {
            type: "label-3d",
            symbolLayers: [{
              type: "text",
              material: {
                color: [110, 146, 181, 1]
              },
              halo: {
                size: 1,
                color: [255, 255, 255, 0.9]
              },
              font: {
                size: 16,
                weight: "bold",
                family: "Euphoria Script",
              }
            }],
            verticalOffset: {
              screenLength: 20,
              maxWorldLength: 10000,
              minWorldLength: 0
            },
            callout: {
              type: "line",
              size: 1,
              color: [110, 146, 181, 1],
            }
          }
        })
      ]
      console.log(pumpsLayer);

      deathsLayer = map.layers.find(function(layer) {
        return layer.title === "Cholera deaths";
      });

      deathsLayer.popupTemplate = {
        title: "{expression/title}",
        content: "The closest pump is {expression/pump} and the minimum distance from this pump is {expression/distance}m.",
        expressionInfos: [{
          name: "pump",
          expression: "var pump = Text($feature.ClosestPump);" +
            "var p = Dictionary(" +
            "'0', 'Broad St Pump'," +
            "'1', 'Carnaby St Pump'," +
            "'2', 'Marlborough Mews Pump'," +
            "'3', 'Dean St Pump'," +
            "'4', 'Rupert St Pump'," +
            "'5', 'Brewer St Pump'," +
            "'6', 'Piccadilly Pump'," +
            "'7', 'Warwick St Pump');"+
          "return IIf(hasKey(p, pump), p[pump], 'No data');"
        }, {
          name: "distance",
          expression: "return Ceil($feature.MinDist, 2);"
        }, {
          name: "title",
          expression: "return IIf($feature.NumDeaths > 1, $feature.NumDeaths + ' cholera death incidents', $feature.NumDeaths + ' cholera death incident');"
        }]
      }
    });
    let graphic = null;

    font.create("./EuphoriaScript-Regular.ttf")
      .then(function (font) {
        var origin = new geometry.Point(-0.1360283724781709, 51.51351779622604, 0);
        var text = "Broad Street";

        var fullMesh = fontmesh.fromString(font, text, origin, {
          size: 10,
          alignment: {
            x: "center"
          }
        });

        function makeGraphic(s, vangle) {

          if (vangle == null) {
            vangle = 0;
          }

          if (graphic) {
            view.graphics.remove(graphic);
          }

          var mesh = s === text ? fullMesh : fontmesh.fromString(font, s, origin, {
            size: 10,
            alignment: {
              x: "center"
            }
          });

          mesh.rotate(vangle, 0, 25, {
            origin: origin
          });

          graphic = new Graphic({
            geometry: mesh,
            symbol: {
              type: "mesh-3d",
              symbolLayers: [{
                type: "fill",
                material: {
                  color: "#555"
                }
              }]
            }
          });

          view.graphics.add(graphic);
        }

        makeGraphic(text);
      })
      .catch(function (err) {
        console.error(err);
      });

    return view;
  };

  return { create: create };
});
