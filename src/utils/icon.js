import { Icon } from "@blueprintjs/core";

export function getIcon(props) {
    let icon = 'dot';
    const {type} = props;
    if(type === 'cicle') icon = 'dot';
    if(type === 'line') icon = 'layout';
    if(type === 'fill') icon = 'polygon-filter';
    if(type === 'raster'||type === 'image') icon = 'media';
    if(type === 'symbol') icon = 'map-marker';
    if(type === 'fill-extrusion') icon = 'widget-footer';
    if(type === 'raster-dem') icon = 'globe-network';
    if(type === 'video') icon = 'video';
    if(type === 'heatmap') icon = 'heatmap';
    if(type === 'background') icon = 'bold';
    return <Icon icon={icon || 'info-sign'} {...props} />
}

export function getImageData(img) {
    const canvas = window.document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('failed to create canvas 2d context');
    }
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    return context.getImageData(0, 0, img.width, img.height);
}

function copyImage(srcImg, dstImg, srcPt, dstPt, size, channels = 4) {
    if (size.width === 0 || size.height === 0) {
        return dstImg;
    }

    if (size.width > srcImg.width ||
        size.height > srcImg.height ||
        srcPt.x > srcImg.width - size.width ||
        srcPt.y > srcImg.height - size.height) {
        return null;
    }

    if (size.width > dstImg.width ||
        size.height > dstImg.height ||
        dstPt.x > dstImg.width - size.width ||
        dstPt.y > dstImg.height - size.height) {
        return null;
    }

    const srcData = srcImg.data;
    const dstData = dstImg.data;

    if(srcData === dstData) return;

    for (let y = 0; y < size.height; y++) {
        const srcOffset = ((srcPt.y + y) * srcImg.width + srcPt.x) * channels;
        const dstOffset = ((dstPt.y + y) * dstImg.width + dstPt.x) * channels;
        for (let i = 0; i < size.width * channels; i++) {
            dstData[dstOffset + i] = srcData[srcOffset + i];
        }
    }

    return dstImg;
}

function createImage({width, height}, channels = 4, data) {
    if (!data) {
        data = new Uint8Array(width * height * channels);
    } else if (data.length !== width * height * channels) {
        return;
    }
    image.width = width;
    image.height = height;
    image.data = data;
    return image;
}

export class RGBAImage {
    constructor(size, data) {
        this.width = size.width;
        this.height = size.height;
        this.data = data || new Uint8Array(this.width * this.height * 4);
    }

    clone() {
        return new RGBAImage({width: this.width, height: this.height}, new Uint8Array(this.data));
    }

    static copy(srcImg, dstImg, srcPt, dstPt, size) {
        copyImage(srcImg, dstImg, srcPt, dstPt, size, 4);
    }

}



export function getIconData({image, json}) {

}