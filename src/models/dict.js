import {saga} from '../utils/ajax';
import {isArray, isString, isObject} from '../utils/util';

const requestDicts = [
    {key:'fieldTypes', url: 'ftype/', type: 'array'},
    {key:'encodings', url: 'encoding/', type: 'array'},
    {key:'crss', url: 'crs/', type:'array'}
];

export default {
    namespace: 'dict',
    state: {
        encodings: [],
        fieldTypes: [],
        crss: [],
    },
    reducers: {
        get(state) {
            return state;
        },
        save(state, {payload}) {
            return {...state, ...payload};
        }
    },
    effects: {
        *fetch({payload: { url, type } }, {call, put}) {
            const { data } = yield call(saga({type: 'get', url}));
            yield put({
                type: 'save',
                payload: {
                    [type]: (data|| []).filter(d => d)
                }
            })
        },
        *init({}, { call, put, select, all }) {
            const dict = yield select(state => state.dict);
            const effects = [];
            for(let i = 0; i < requestDicts.length; i++) {
                const d = requestDicts[i];
                const unit = dict[d.key];
                if(!dict[d.key] || (d.type === 'array' && isArray(unit) && !unit.length)) {
                    effects.push(put({type: 'fetch', payload: {url: d.url, type: d.key}}));
                }
            }
            yield all(effects);
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
                dispatch({ type: 'init'});
            });
        }
    }
}