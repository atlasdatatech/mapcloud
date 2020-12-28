import {isFunction} from './util';

export function animateFrame({clip, interval, times, timer, end}) {
    if(!clip || !isFunction(clip)) {
        throw new Error('animate clip is not function');
    }
    let _animateSign = null;
    if(interval !== undefined) {
        let start = 0;
        _animateSign = setInterval(() => {
            clip();
            if(times !== undefined) {
                start++;
                if(start >= times) {
                    clearInterval(_animateSign);
                    end && end();
                }
            }
            if(timer !== undefined) {
                start += interval;
                if(start >= timer) {
                    clearInterval(_animateSign);
                    end && end();
                }
            }
        }, interval);
    } else {
        
        function _animate() {
            clip();
            let start = 0;
            if(times !== undefined) {
                start++;
                if(start >= times) {
                    cancelAnimationFrame(_animateSign);
                    end && end();
                }
            }
            if(timer !== undefined) {
                start += interval;
                if(start >= timer) {
                    cancelAnimationFrame(_animateSign);
                    end && end();
                }
            }
            _animateSign = requestAnimationFrame(_animate);
        }
        _animate();
    }

    // return () => {
    //     return { id: _animateSign}
    // }

    return _animateSign;
}

export function flashLayer({map, layer, property, on, off, interval, times, timer, type, end}) {
    if(!map || !layer || !property || on === undefined || off === undefined) return;
    type = (type|| 'paint').toLowerCase();
    let flag = true;
    let val =  undefined;
    if(type === 'paint') {
        val = map.getPaintProperty(layer, property);
    }
    if(type === 'layout') {
        val = map.getLayoutProperty(layer, property);
    }
    return animateFrame({
        clip: () => {
            if(type === 'paint') {
                map.setPaintProperty(layer, property, flag ? on : off);
            }
            if(type === 'layout') {
                map.setLayoutProperty(layer, property, flag ? on : off);
            }
            flag = !flag;
        },
        end: () => {
            if(val !== undefined) {
                if(type === 'paint') {
                    map.setPaintProperty(layer, property, val);
                }
                if(type === 'layout') {
                    map.setLayoutProperty(layer, property, val);
                }
            }
            end && end();
        },
        interval,
        times,
        timer
    });
}