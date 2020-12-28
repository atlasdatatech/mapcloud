import { Component } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Button, Card, Elevation, FormGroup, InputGroup } from "@blueprintjs/core";
import { HelpListComponent } from '../../components/Help';
import layoutStyles from '../../styles/common/mainLayout.less';
import {ajax_get, ajax_post} from '../../utils/ajax';
import Toaster from '../../components/Toaster';
import {checkPhone} from '../../utils/util';

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            oldPassword: '',
            newPassword: '',
            repeatNewPassword: '',
        }
    }

    updateUser(_user) {
        if(!_user) return;
        const {user} = this.state;
        for(const key in _user) {
            user[key] = _user[key];
        }
        this.setState({user});
    }

    modifyUser = () => {
        const {user} = this.state;
        if(user.phone && !checkPhone(user.phone)) {
            Toaster.show({message: '手机验证错误', intent:'danger', icon:'delete'});
            return;
        }
        ajax_post({url: `account/update/`, data:{
            phone: user.phone,
            company: user.company,
            department: user.department,
        }}).then((res) => {
            if(res && res.code === 200) {
                Toaster.show({message: '更新成功', intent:'success', icon:'tick-circle'});
            } else {
                Toaster.show({message: res.msg || '更新失败', intent:'danger', icon:'delete'});
            }
        });
    }

    modifyPassword = () =>{
        const {newPassword, oldPassword, repeatNewPassword} = this.state; 
        if(!newPassword || !oldPassword || !repeatNewPassword) {
            Toaster.show({message:'密码重置中有密码为空值，请重新输入', intent:'danger', icon:'key'});
            return;
        }
        if(newPassword!== repeatNewPassword) {
            Toaster.show({message:'两次输入的新密码不一致，请重新输入', intent:'danger', icon:'key'});
            return;
        }
        ajax_post({url: 'account/password/', data: {
            password: oldPassword, 
            newpassword: newPassword, 
            newconfirm: repeatNewPassword
        }}).then((res) => {
            if(res && res.code === 200) {
                this.setState({newPassword:'', oldPassword:'', repeatNewPassword: ''});
                Toaster.show({message:'密码已重置，请重新登录', intent:'success', icon:'key'});
                setTimeout(() => {
                    location.href = './login.html';
                }, 2000);
            } else {
                Toaster.show({message:res.msg || '密码重置错误，请检查输入项', intent:'danger', icon:'key'});
            }
        })
    }

    componentWillMount() {
        ajax_get({url: 'account/'}).then((res) => {
            if(res && res.code === 200 && res.data) {
                this.setState({user: res.data});
            } else {
                this.setState({user: null});
            }
        });
    }

    render() {
        const {user, newPassword, oldPassword, repeatNewPassword} = this.state;
        if(!user) return <div></div>;
        const passwordIsNotEqual = repeatNewPassword && repeatNewPassword !== newPassword;
        const canClickModifyPassword =  
            oldPassword && 
            repeatNewPassword && 
            repeatNewPassword === newPassword &&
            repeatNewPassword.length >= 6;
        const isNotPhone = user.phone && !checkPhone(user.phone);
        return (
            <div className="clearfix">
                <div className={classNames(layoutStyles.main, styles.main)} style={{float:'right', marginRight:'0px'}}>
                    <Card  elevation={Elevation.THREE} className='pd-5 mgb-5'>
                        <h3 className='mgb-3'>个人信息</h3>
                        <div className='row pd-1'>
                            <FormGroup
                                className = 'mgb-3'
                                helperText="注册后暂不可修改，如需修改，请联系技术与售后支持"
                                label= {<p className={styles.label}>Email *</p>}
                                labelFor="email"
                            >
                                <InputGroup id="email" value={user.email} placeholder="请输入Email地址" readOnly={true} />
                            </FormGroup>
                            <FormGroup
                                className = 'mgb-3'
                                label= {<p className={styles.label}>手机号</p>}
                                labelFor="tel"
                            >
                                <InputGroup 
                                    onChange={(e) => { this.updateUser({phone: e.target.value}) }} 
                                    value={user.phone} 
                                    intent = {isNotPhone ? 'danger' : 'normal'}
                                    placeholder="请输入手机号"
                                 />
                            </FormGroup>
                            <FormGroup
                                className='mgb-3'
                                label= {<p className={styles.label}>公司/组织</p>}
                                labelFor="org"
                            >
                                <InputGroup onChange={(e) => { this.updateUser({company: e.target.value}) }} value={user.company} placeholder="请输入公司/组织" />
                            </FormGroup>
                            <FormGroup
                                className='mgb-3'
                                label= {<p className={styles.label}>部门</p>}
                                labelFor="org"
                            >
                                <InputGroup onChange={(e) => { this.updateUser({department: e.target.value}) }} value={user.department} placeholder="请输入部门名称" />
                            </FormGroup>
                            <Button intent='primary' large='true' onClick={this.modifyUser}>更新信息</Button>
                        </div>
                    </Card>
                    <Card  elevation={Elevation.THREE} className='pd-5'>
                        <h3 className='mgb-3'>修改密码</h3>
                        <div className='row pd-1'>
                            <FormGroup
                                className='mgb-3'
                                helperText="请输入旧密码"
                                label= {<p className={styles.label}>原密码</p>}
                                labelFor="oldPassword"
                            >
                                <InputGroup 
                                    onChange={(e) => {this.setState({oldPassword: e.target.value})}} 
                                    value={oldPassword} 
                                    type='password' 
                                    placeholder="请输入旧密码"
                                 />
                            </FormGroup>
                            <FormGroup
                                className='mgb-3'
                                helperText="6位以上字母、数字、符号任意组合"
                                label= {<p className={styles.label}>新密码</p>}
                                labelFor="password"
                            >
                                <InputGroup 
                                onChange={(e) => {this.setState({newPassword: e.target.value})}} 
                                value={newPassword} 
                                type='password' 
                                intent={passwordIsNotEqual ? 'danger':'normal'}
                                placeholder="请输入新密码" />
                            </FormGroup>
                            <FormGroup
                                className='mgb-3'
                                helperText={passwordIsNotEqual ? "两次输入的密码不一样" : "请再次输入密码" }
                                label={<p className={styles.label}>确认密码</p>}
                                labelFor="passwordCOnfirm"
                            >
                                <InputGroup 
                                 onChange={(e) => {this.setState({repeatNewPassword: e.target.value})}} 
                                value={repeatNewPassword} 
                                type='password' 
                                intent={passwordIsNotEqual ? 'danger':'normal'}
                                placeholder="请再次输入新密码" />
                            </FormGroup>
                            <Button intent='primary' large='true' disabled={!canClickModifyPassword} onClick={this.modifyPassword}>修改密码</Button>
                        </div>
                    </Card>
                </div>
                <div className={classNames(layoutStyles.side, 'pd-2 at-side')}>
                    <HelpListComponent type='ACCOUNT' />
                </div>
                
            </div>
        )
    }
}