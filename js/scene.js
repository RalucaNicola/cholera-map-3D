define([
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/views/3d/support/debugFlags",
  "esri/Graphic",
  "esri/layers/FeatureLayer",
  "esri/layers/support/LabelClass",
  "esri/geometry",
  "./font",
  "./fontmesh"
], function (WebScene, SceneView, debugFlags, Graphic, FeatureLayer,LabelClass, geometry, font, fontmesh) {

  function create() {
    // debugFlags.DRAW_MESH_GEOMETRY_NORMALS = true;

    var map = new WebScene({
      portalItem: {
        id: "2535399d4a6040fd8c60c46d57209548"
      }
    });

    var view = new SceneView({
      container: "viewDiv",
      map: map,
      qualityProfile: "high"
    });

    var thiessenPolygons = new FeatureLayer({
      url: "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/ArcGIS/rest/services/PumpsThiessenPolygons/FeatureServer/0",
      elevationInfo: {
        mode: "relative-to-ground",
        offset: -1,
        unit: "meters"
      },
      renderer: {
        type: "unique-value",
        field: "Pump_FID",
        defaultSymbol: {
          type: "polygon-3d",
          symbolLayers: [{
            type: "fill",
            material: {color: [230, 230, 230, 1]},
            outline: {
              color: [70, 70, 70, 1],
              size: 2
            }
          }]
        },
        uniqueValueInfos: [{
          value: 0,
          symbol: {
            type: "polygon-3d",
            symbolLayers: [{
              type: "fill",
              material: {color: [200, 200, 200, 1]},
              outline: {
                color: [70, 70, 70, 1],
                size: 2
              }
            }]
          }
        }]
      }
    });

    var pumps = new FeatureLayer({
      url: "https://services2.arcgis.com/cFEFS0EWrhfDeVw9/ArcGIS/rest/services/Pumps/FeatureServer/2",
      renderer: {
        type: "unique-value",
        field: "FID",
        defaultSymbol: {
          type: "point-3d",
          symbolLayers: [{
            type: "object",
            resource: {
              primitive: "cylinder"
            },
            material: {
              color: [230, 230, 230, 1]
            },
            depth: 10,
            height: 60,
            width: 10
          }]
        },
        uniqueValueInfos: [{
          value: 1,
          symbol: {
            type: "point-3d",
            symbolLayers: [{
              type: "object",
              resource: {
                primitive: "cylinder"
              },
              material: {
                color: [200, 200, 200, 1]
              },
              depth: 10,
              height: 60,
              width: 10
            }]
          }
        }]
      },
      labelingInfo: [
        new LabelClass({
          labelExpressionInfo: {expression: "$feature.Name"},
          //labelPlacement: "below-right",
          symbol: {
            type: "label-3d",
            symbolLayers: [{
              type: "text",
              material: {
                color: [50, 50, 50, 1]
              },
              halo: {
                size: 2,
                color: [255, 255, 255, 1]
              },
              font: {
                size: 14,
                family: "sans-serif",
              }
            }],
            verticalOffset: {
              screenLength: 40,
              maxWorldLength: 500000,
              minWorldLength: 0
            },
            callout: {
              type: "line",
              size: 2,
              color: [255, 255, 255, 1],
              border: {
                color: [0, 0, 0, 1]
              }
            }
          }
        })
      ]
    });
    map.addMany([thiessenPolygons, pumps]);

    var graphic = null;

    // font.create("./font.ttf")
    //   .then(function (font) {
    //     var origin = new geometry.Point(-0.1360283724781709, 51.51351779622604, 0);
    //     var text = "Broad Street";
    //
    //     var fullMesh = fontmesh.fromString(font, text, origin, {
    //       size: 10,
    //       alignment: {
    //         x: "center"
    //       }
    //     });
    //
    //     function makeGraphic(s, vangle) {
    //       if (vangle == null) {
    //         vangle = 0;
    //       }
    //
    //       if (graphic) {
    //         view.graphics.remove(graphic);
    //       }
    //
    //       var mesh = s === text ? fullMesh : fontmesh.fromString(font, s, origin, {
    //         size: 10,
    //         alignment: {
    //           x: "center"
    //         }
    //       });
    //
    //       // Rotate so it stands up
    //       mesh.rotate(vangle, 0, 25, {
    //         origin: origin
    //       });
    //
    //       graphic = new Graphic({
    //         geometry: mesh,
    //         symbol: {
    //           type: "mesh-3d",
    //           symbolLayers: [{
    //             type: "fill",
    //             material: {
    //               color: "#555"
    //             }
    //           }]
    //         }
    //       });
    //
    //       view.graphics.add(graphic);
    //     }
    //
    //     {
    //       var i = 0;
    //
    //       window.typeIt = function typeIt() {
    //         i += 1;
    //
    //         makeGraphic(text.slice(0, i));
    //
    //         if (i !== text.length) {
    //           setTimeout(typeIt, 1);
    //         }
    //       }
    //     }
    //
    //     {
    //       var start = -90;
    //       var stop = 90;
    //       var t = 0;
    //
    //       var direction = 1;
    //
    //       window.rotateIt = function rotateIt() {
    //         t = Math.max(0, Math.min(1, t + direction * 0.05));
    //
    //         var te = 1 - ((1 - t) * (1 - t) * (1 - t));
    //
    //         makeGraphic(text, te * (stop - start) + start);
    //
    //         if (direction > 0 && t < 1 || direction < 0 && t > 0) {
    //           setTimeout(rotateIt, 1);
    //         } else {
    //           setTimeout(function () {
    //             direction = -direction;
    //             rotateIt();
    //           }.bind(direction), 2000);
    //         }
    //       }
    //     }
    //
    //     makeGraphic(text);
    //   })
    //   .otherwise(function (err) {
    //     console.error(err);
    //   });

    return view;
  };

  return { create: create };
});