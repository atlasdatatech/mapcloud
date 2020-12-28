import { Alert } from "@blueprintjs/core";

export default function DeleteAlert(props) {
    const {isOpen, cancelHandler, confirmHandler, desc} = props;
    return (
        <Alert 
        icon='delete'
        className="disable-user-select"
        intent='danger'
        isOpen={isOpen}
        onCancel={cancelHandler} 
        onConfirm={confirmHandler} 
        cancelButtonText='取消' 
        confirmButtonText='确认'>
        <p>{desc || '确定要删除此数据集吗，删除后将无法恢复，并影响关联的地图和应用'}</p>
        </Alert>
    )
}