import geojsonlint from "@mapbox/geojsonhint";
import {merge, guid, isArray, isEmptyObject} from './util';

const FeatureOption = {
    type: ' Feature',
    coordinates: [],
    properties: {}
};

export class Feature {
    constructor(options) {
        const o = merge(FeatureOption, options);
        const {type, coordinates, properties} = o;
        this.type = type;
        this.coordinates = coordinates;
        this.properties = properties;
        this.id = guid(true);
        this.properties.atlas_id = id;
    }

    _lint(json, err) {
        const errors = geojsonlint.hint(json);
        if(errors && errors.length > 0) {
            err && err(errors);
            return false;
        }
        return true;
    }

    set(data, err) {
        if(!this._lint(data, err)) return;
        const o = merge({}, data);
        const {geometry, properties} = o;
        if(geometry) {
            this.type = geometry.type;
            this.coordinates = geometry.coordinates;
        }
        if(properties && !isEmptyObject(properties)) {
            this.properties = properties;
            this.properties.atlas_id = this.id;
        }
    }

    setProp(key, value) {
        this.properties[key] = value;
    }

    removeProp(key) {
        delete this.properties[key];
    }

    clearProps() {
        this.properties = {
            atlas_id: this.id
        };
    }

    setCoordinates(coordinates) {
        this.coordinates = coordinates;
    }

    get() {
        return {
            type: 'Feature',
            geometry: {
                type: this.type,
                coordinates: this.coordinates,
            },
            properties: this.properties,
        }
    }
}


export class FeatureCollection {
    constructor(featuresGeojson) {
        this.type = 'FeatureCollection';
        this.features = [];
        this._initFeatures(featuresGeojson);
    }

    _initFeatures(featuresGeojson) {
        if(featuresGeojson) {
            const features = this._lintFeatures(featuresGeojson) ? features: [];
            this.features = features.map(f => new Feature(f));
        }
    }

    _lintFeature(geojson) {
        const errors = geojsonlint.hint(geojson);
        if(errors && errors.length > 0) {
            err && err(errors);
            return false;
        }
        return true;
    }

    _lintFeatures(featuresGeojson) {
        if(!isArray(featuresGeojson)) return false;
        return features.map((featureGeojson) => this._lintFeature(featureGeojson))
            .filter(r => !r).length > 0;
    }

    clear() {
        this.features = [];
    }

    get() {
        return {
            type: this.type,
            features: this.features.map(f => f.get())
        }
    }

    getFeatures() {
        return this.features.filter(f => f);
    }

    addFeature(featureGeojson, err) {
        if(this._lintFeature(featureGeojson, err)) return;
        this.features.push(new Feature(featureGeojson));
    }

    getFeature(id) {
        return this.features.filter(f => f.id === id)[0];
    }

    setFeature(feature, err) {
        if(feature instanceof Feature) {
            const {features} = this;
            for(let i = 0, len = features.length; i < len; i++) {
                if(feature.id === features[i].id) {
                    features[i] = feature;
                    break;
                }
            }
        }
    }

    setFeatureWithJson(id, featureGeojson, err) {
        if(!this._lintFeature(featureGeojson, err)) return;
        const {features} = this;
        for(let i = 0, len = features.length; i < len; i++) {
            if(id === features[i].id) {
                feature.set(feature);
                break;
            }
        }
    }
}