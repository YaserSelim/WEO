defineSuite([
        'DataSources/ModelGraphics',
        'Core/Cartesian3',
        'Core/Color',
        'Core/DistanceDisplayCondition',
        'Core/JulianDate',
        'Core/Quaternion',
        'DataSources/ConstantProperty',
        'DataSources/NodeTransformationProperty',
        'DataSources/PropertyBag',
        'Scene/ClippingPlaneCollection',
        'Scene/ColorBlendMode',
        'Scene/HeightReference',
        'Scene/ShadowMode'
    ], function(
        ModelGraphics,
        Cartesian3,
        Color,
        DistanceDisplayCondition,
        JulianDate,
        Quaternion,
        ConstantProperty,
        NodeTransformationProperty,
        PropertyBag,
        ClippingPlaneCollection,
        ColorBlendMode,
        HeightReference,
        ShadowMode) {
    'use strict';

    it('creates expected instance from raw assignment and construction', function() {
        var options = {
            uri : '0',
            scale : 1,
            show : false,
            minimumPixelSize : 2,
            maximumScale : 200,
            incrementallyLoadTextures : false,
            runAnimations : false,
            clampAnimations : false,
            shadows : ShadowMode.DISABLED,
            heightReference : HeightReference.CLAMP_TO_GROUND,
            distanceDisplayCondition : new DistanceDisplayCondition(),
            silhouetteColor : new Color(1.0, 0.0, 0.0, 1.0),
            silhouetteSize : 3.0,
            color : new Color(0.0, 1.0, 0.0, 0.2),
            colorBlendMode : ColorBlendMode.HIGHLIGHT,
            colorBlendAmount : 0.5,
            clippingPlanes : new ClippingPlaneCollection(),
            nodeTransformations : {
                node1 : {
                    translation : Cartesian3.UNIT_Y,
                    rotation : new Quaternion(0.5, 0.5, 0.5, 0.5),
                    scale : Cartesian3.UNIT_X
                }
            }
        };

        var model = new ModelGraphics(options);
        expect(model.uri).toBeInstanceOf(ConstantProperty);
        expect(model.scale).toBeInstanceOf(ConstantProperty);
        expect(model.show).toBeInstanceOf(ConstantProperty);
        expect(model.minimumPixelSize).toBeInstanceOf(ConstantProperty);
        expect(model.maximumScale).toBeInstanceOf(ConstantProperty);
        expect(model.incrementallyLoadTextures).toBeInstanceOf(ConstantProperty);
        expect(model.shadows).toBeInstanceOf(ConstantProperty);
        expect(model.heightReference).toBeInstanceOf(ConstantProperty);
        expect(model.distanceDisplayCondition).toBeInstanceOf(ConstantProperty);
        expect(model.silhouetteColor).toBeInstanceOf(ConstantProperty);
        expect(model.silhouetteSize).toBeInstanceOf(ConstantProperty);
        expect(model.color).toBeInstanceOf(ConstantProperty);
        expect(model.colorBlendMode).toBeInstanceOf(ConstantProperty);
        expect(model.colorBlendAmount).toBeInstanceOf(ConstantProperty);
        expect(model.clippingPlanes).toBeInstanceOf(ConstantProperty);
        expect(model.runAnimations).toBeInstanceOf(ConstantProperty);
        expect(model.clampAnimations).toBeInstanceOf(ConstantProperty);

        expect(model.nodeTransformations).toBeInstanceOf(PropertyBag);

        expect(model.uri.getValue()).toEqual(options.uri);
        expect(model.scale.getValue()).toEqual(options.scale);
        expect(model.show.getValue()).toEqual(options.show);
        expect(model.minimumPixelSize.getValue()).toEqual(options.minimumPixelSize);
        expect(model.maximumScale.getValue()).toEqual(options.maximumScale);
        expect(model.incrementallyLoadTextures.getValue()).toEqual(options.incrementallyLoadTextures);
        expect(model.shadows.getValue()).toEqual(options.shadows);
        expect(model.heightReference.getValue()).toEqual(options.heightReference);
        expect(model.distanceDisplayCondition.getValue()).toEqual(options.distanceDisplayCondition);
        expect(model.silhouetteColor.getValue()).toEqual(options.silhouetteColor);
        expect(model.silhouetteSize.getValue()).toEqual(options.silhouetteSize);
        expect(model.color.getValue()).toEqual(options.color);
        expect(model.colorBlendMode.getValue()).toEqual(options.colorBlendMode);
        expect(model.colorBlendAmount.getValue()).toEqual(options.colorBlendAmount);
        expect(model.clippingPlanes.getValue().planes).toEqual(options.clippingPlanes.planes);
        expect(model.runAnimations.getValue()).toEqual(options.runAnimations);
        expect(model.clampAnimations.getValue()).toEqual(options.clampAnimations);

        var actualNodeTransformations = model.nodeTransformations.getValue(new JulianDate());
        var expectedNodeTransformations = options.nodeTransformations;

        // by default toEqual requires constructors to match.  for the purposes of this test, we only care about the structure.
        actualNodeTransformations = JSON.parse(JSON.stringify(actualNodeTransformations));
        expectedNodeTransformations = JSON.parse(JSON.stringify(expectedNodeTransformations));
        expect(actualNodeTransformations).toEqual(expectedNodeTransformations);
    });

    it('merge assigns unassigned properties', function() {
        var source = new ModelGraphics();
        source.uri = new ConstantProperty('');
        source.show = new ConstantProperty(true);
        source.scale = new ConstantProperty(1.0);
        source.minimumPixelSize = new ConstantProperty(2.0);
        source.maximumScale = new ConstantProperty(200.0);
        source.incrementallyLoadTextures = new ConstantProperty(true);
        source.shadows = new ConstantProperty(ShadowMode.ENABLED);
        source.heightReference = new ConstantProperty(HeightReference.CLAMP_TO_GROUND);
        source.distanceDisplayCondition = new ConstantProperty(new DistanceDisplayCondition());
        source.silhouetteColor = new ConstantProperty(new Color(1.0, 0.0, 0.0, 1.0));
        source.silhouetteSize = new ConstantProperty(3.0);
        source.color = new ConstantProperty(new Color(0.0, 1.0, 0.0, 0.2));
        source.colorBlendMode = new ConstantProperty(ColorBlendMode.HIGHLIGHT);
        source.colorBlendAmount = new ConstantProperty(0.5);
        source.clippingPlanes = new ConstantProperty(new ClippingPlaneCollection());
        source.runAnimations = new ConstantProperty(true);
        source.clampAnimations = new ConstantProperty(true);
        source.nodeTransformations = {
            node1 : new NodeTransformationProperty({
                translation : Cartesian3.UNIT_Y,
                rotation : new Quaternion(0.5, 0.5, 0.5, 0.5),
                scale : Cartesian3.UNIT_X
            }),
            node2 : new NodeTransformationProperty({
                scale : Cartesian3.UNIT_Z
            })
        };

        var target = new ModelGraphics();
        target.merge(source);

        expect(target.uri).toBe(source.uri);
        expect(target.show).toBe(source.show);
        expect(target.scale).toBe(source.scale);
        expect(target.minimumPixelSize).toBe(source.minimumPixelSize);
        expect(target.maximumScale).toBe(source.maximumScale);
        expect(target.incrementallyLoadTextures).toBe(source.incrementallyLoadTextures);
        expect(target.shadows).toBe(source.shadows);
        expect(target.heightReference).toBe(source.heightReference);
        expect(target.distanceDisplayCondition).toBe(source.distanceDisplayCondition);
        expect(target.silhouetteColor).toEqual(source.silhouetteColor);
        expect(target.silhouetteSize).toEqual(source.silhouetteSize);
        expect(target.color).toBe(source.color);
        expect(target.colorBlendMode).toBe(source.colorBlendMode);
        expect(target.colorBlendAmount).toBe(source.colorBlendAmount);
        expect(target.clippingPlanes).toBe(source.clippingPlanes);
        expect(target.runAnimations).toBe(source.runAnimations);
        expect(target.clampAnimations).toBe(source.clampAnimations);
        expect(target.nodeTransformations).toEqual(source.nodeTransformations);
    });

    it('merge does not assign assigned properties', function() {
        var source = new ModelGraphics();
        source.uri = new ConstantProperty('');
        source.show = new ConstantProperty(true);
        source.scale = new ConstantProperty(1.0);
        source.minimumPixelSize = new ConstantProperty(2.0);
        source.maximumScale = new ConstantProperty(200.0);
        source.incrementallyLoadTextures = new ConstantProperty(true);
        source.shadows = new ConstantProperty(ShadowMode.ENABLED);
        source.heightReference = new ConstantProperty(HeightReference.CLAMP_TO_GROUND);
        source.distanceDisplayCondition = new ConstantProperty(new DistanceDisplayCondition());
        source.silhouetteColor = new ConstantProperty(new Color());
        source.silhouetteSize = new ConstantProperty(1.0);
        source.color = new ConstantProperty(new Color(0.0, 1.0, 0.0, 0.2));
        source.colorBlendMode = new ConstantProperty(ColorBlendMode.HIGHLIGHT);
        source.colorBlendAmount = new ConstantProperty(0.5);
        source.clippingPlanes = new ConstantProperty(new ClippingPlaneCollection());
        source.runAnimations = new ConstantProperty(true);
        source.clampAnimations = new ConstantProperty(true);
        source.nodeTransformations = {
            transform : new NodeTransformationProperty()
        };

        var uri = new ConstantProperty('');
        var show = new ConstantProperty(true);
        var scale = new ConstantProperty(1.0);
        var minimumPixelSize = new ConstantProperty(2.0);
        var maximumScale = new ConstantProperty(200.0);
        var incrementallyLoadTextures = new ConstantProperty(true);
        var shadows = new ConstantProperty(ShadowMode.ENABLED);
        var heightReference = new ConstantProperty(HeightReference.CLAMP_TO_GROUND);
        var distanceDisplayCondition = new ConstantProperty(new DistanceDisplayCondition());
        var silhouetteColor = new ConstantProperty(new Color());
        var silhouetteSize = new ConstantProperty(1.0);
        var color = new ConstantProperty(new Color(0.0, 1.0, 0.0, 0.2));
        var colorBlendMode = new ConstantProperty(ColorBlendMode.HIGHLIGHT);
        var colorBlendAmount = new ConstantProperty(0.5);
        var clippingPlanes = new ConstantProperty(new ClippingPlaneCollection());
        var runAnimations = new ConstantProperty(true);
        var clampAnimations = new ConstantProperty(true);
        var nodeTransformations = new PropertyBag({
            transform : new NodeTransformationProperty()
        });

        var target = new ModelGraphics();
        target.uri = uri;
        target.show = show;
        target.scale = scale;
        target.minimumPixelSize = minimumPixelSize;
        target.maximumScale = maximumScale;
        target.incrementallyLoadTextures = incrementallyLoadTextures;
        target.shadows = shadows;
        target.heightReference = heightReference;
        target.distanceDisplayCondition = distanceDisplayCondition;
        target.silhouetteColor = silhouetteColor;
        target.silhouetteSize = silhouetteSize;
        target.color = color;
        target.colorBlendMode = colorBlendMode;
        target.colorBlendAmount = colorBlendAmount;
        target.clippingPlanes = clippingPlanes;
        target.runAnimations = runAnimations;
        target.clampAnimations = clampAnimations;
        target.nodeTransformations = nodeTransformations;

        target.merge(source);

        expect(target.uri).toBe(uri);
        expect(target.show).toBe(show);
        expect(target.scale).toBe(scale);
        expect(target.minimumPixelSize).toBe(minimumPixelSize);
        expect(target.maximumScale).toBe(maximumScale);
        expect(target.incrementallyLoadTextures).toBe(incrementallyLoadTextures);
        expect(target.shadows).toBe(shadows);
        expect(target.heightReference).toBe(heightReference);
        expect(target.distanceDisplayCondition).toBe(distanceDisplayCondition);
        expect(target.silhouetteColor).toBe(silhouetteColor);
        expect(target.silhouetteSize).toBe(silhouetteSize);
        expect(target.color).toBe(color);
        expect(target.colorBlendMode).toBe(colorBlendMode);
        expect(target.colorBlendAmount).toBe(colorBlendAmount);
        expect(target.clippingPlanes).toBe(clippingPlanes);
        expect(target.runAnimations).toBe(runAnimations);
        expect(target.clampAnimations).toBe(clampAnimations);
        expect(target.nodeTransformations).toBe(nodeTransformations);
    });

    it('clone works', function() {
        var source = new ModelGraphics();
        source.uri = new ConstantProperty('');
        source.show = new ConstantProperty(true);
        source.scale = new ConstantProperty(1.0);
        source.minimumPixelSize = new ConstantProperty(2.0);
        source.maximumScale = new ConstantProperty(200.0);
        source.incrementallyLoadTextures = new ConstantProperty(true);
        source.shadows = new ConstantProperty(ShadowMode.ENABLED);
        source.heightReference = new ConstantProperty(HeightReference.CLAMP_TO_GROUND);
        source.distanceDisplayCondition = new ConstantProperty(new DistanceDisplayCondition());
        source.silhouetteColor = new ConstantProperty(new Color());
        source.silhouetteSize = new ConstantProperty(2.0);
        source.color = new ConstantProperty(new Color(0.0, 1.0, 0.0, 0.2));
        source.colorBlendMode = new ConstantProperty(ColorBlendMode.HIGHLIGHT);
        source.colorBlendAmount = new ConstantProperty(0.5);
        source.clippingPlanes = new ConstantProperty(new ClippingPlaneCollection());
        source.runAnimations = new ConstantProperty(true);
        source.clampAnimations = new ConstantProperty(true);
        source.nodeTransformations = {
            node1 : new NodeTransformationProperty(),
            node2 : new NodeTransformationProperty()
        };

        var result = source.clone();
        expect(result.uri).toBe(source.uri);
        expect(result.show).toBe(source.show);
        expect(result.scale).toBe(source.scale);
        expect(result.minimumPixelSize).toBe(source.minimumPixelSize);
        expect(result.maximumScale).toBe(source.maximumScale);
        expect(result.incrementallyLoadTextures).toBe(source.incrementallyLoadTextures);
        expect(result.shadows).toBe(source.shadows);
        expect(result.heightReference).toBe(source.heightReference);
        expect(result.distanceDisplayCondition).toBe(source.distanceDisplayCondition);
        expect(result.silhouetteColor).toEqual(source.silhouetteColor);
        expect(result.silhouetteSize).toEqual(source.silhouetteSize);
        expect(result.color).toBe(source.color);
        expect(result.colorBlendMode).toBe(source.colorBlendMode);
        expect(result.colorBlendAmount).toBe(source.colorBlendAmount);
        expect(result.clippingPlanes).toBe(source.clippingPlanes);
        expect(result.runAnimations).toBe(source.runAnimations);
        expect(result.clampAnimations).toBe(source.clampAnimations);
        expect(result.nodeTransformations).toEqual(source.nodeTransformations);
    });

    it('merge throws if source undefined', function() {
        var target = new ModelGraphics();
        expect(function() {
            target.merge(undefined);
        }).toThrowDeveloperError();
    });
});
