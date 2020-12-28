import { Toaster } from "@blueprintjs/core";

 const ExToaster = Toaster.create({
    className: "recipe-toaster",
    position: 'bottom-right',
    // timeout: 1000,
    canEscapeKeyClear: true,
});

export function ToasterError(props) {
    ExToaster.show({message:props.message || '错误', intent:'danger', icon:'error', ...props});
}

export function ToasterSuccess(props) {
    ExToaster.show({message:props.message || '成功', intent:'success', icon:'tick-circle', ...props});
}

export function ToasterWarning(props) {
    ExToaster.show({message:props.message || '提示', intent:'warning', icon:'issue', ...props});
}

export function ToasterInfo(props) {
    ExToaster.show({message:props.message , intent:'primary', icon:'issue', ...props});
}

export default ExToaster;