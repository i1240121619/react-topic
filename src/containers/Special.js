import React from 'react';
import update  from 'react-addons-update';

import Picture from '../components/picture/Picture';
import Video from '../components/video/Video';
import Baopin from '../components/baopin/Baopin';
import UploadPictures from '../components/uploadPictures/UploadPictures';
import Package from '../components/package/Package';


export default class Special extends React.Component {
    constructor(props) {
        super(props);
        wxJsdk.wxConfig()//微信接口初始化
        this.choice= this._choice.bind(this);
        //tool.delSession('store');
        console.log("================tool.getSession('store')================")
        console.log(tool.getSession('store'))

        if(tool.getSession('store')){
            this.state=tool.getSession('store')
        }else{
            this.state= {
                id:tool.getQueryString('id')||alert('页面id不能为空'),
                openid:tool.getQueryString('openid'),
                LoadingState:1,//数据是否加载完毕
                isPreview:0,//是否为预览状态
                specialState: {
                    channel:'',
                    status:'1',
                    activityName:'益丰大药房',
                    LoadingState: 0,//数据是否加载完毕
                    specialData:{},//页面需要的数据
                },//页面页面
            }
            this.uploadAjax(this.state.id)
        }//if判断数据来源
    }//constructor

    _choice(){
        return
    }

    uploadAjax(a){
        let data={activityCode:a}
        $.ajax({
            url:backendHost+'/colombo/ActivityService/findActivityContent',
            type: "POST",
            data:JSON.stringify(data),
            success: function(data) {
                var floorList=data.floorList
                if(data.styleList[0]){
                    floorList.push(data.styleList[0])
                }
                let dataNew= update(data,{floorList:{$set:floorList}});
                console.log("================findActivityContent--dataNew================")
                console.log(dataNew)
                document.title=dataNew.activityName
                this.setState({
                    specialState:{
                        channel:dataNew.channel,
                        status:dataNew.status,
                        activityName:dataNew.activityName,
                        LoadingState: 1,//数据是否加载完毕
                        specialData:dataNew
                    },
                })//初始化
                wxJsdk.wxShare({title:data.activityName,description:data.note,link:JkrOauth2Servlet+data.activityUrl,imgUrl:data.picUrl})
            }.bind(this),
            error: function (error) {
                console.log("================error.status================")
                console.log("查询接口--findActivityContent : "+error)
                alert("查询接口--findActivityContent : "+error)

            },
            //timeout: 5000,//超时时间设置，单位毫秒
        });//ajax

    }//uploadAjax

    render() {
        let specialState=this.state.specialState
        let specialData=specialState.specialData
        let floorList=specialData.floorList

        return (
            <div className={this.state.isPreview?"MobileScreenposition":"MobileScreenpositionSJ"}>
                <div className="mainInAll">
                    <div className={specialState.LoadingState?"main mainIn":"main"}>
                        <div className={specialState.LoadingState?"show":"hide"}>
                            {floorList ? floorList.map((item, index)=> {
                                if(item.setType=="pictures"){
                                    return (
                                        <Picture isPreview={this.state.isPreview} activated={this.state.activated} action={this.choice} serialNumber={index} key={index} data={specialData.floorList[index]}/>
                                    )
                                }else if(item.setType=="page"){
                                    return (
                                        <Baopin openid={this.state.openid} channel={this.state.specialState.channel} isPreview={this.state.isPreview} activated={this.state.activated} action={this.choice} serialNumber={index} key={index} data={specialData.floorList[index]}/>
                                    )
                                }else if(item.setType=="videos"){
                                    return (
                                        <Video isPreview={this.state.isPreview} activated={this.state.activated} action={this.choice} serialNumber={index} key={index} data={specialData.floorList[index]}/>
                                    )
                                }

                            }):null}
                            <div id="foot"></div>
                        </div>
                        <div className={this.state.specialState.status==0?"status show":"status hide"}>
                            <div className="ts">
                                <span>抱歉，页面已经过期了！</span>
                            </div>
                        </div>
                        <div className={this.state.specialState.status==2?"status show":"status hide"}>
                            <div className="ts">
                                <span>页面还未生效哦！</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )

    }//render

    componentDidUpdate(){
        var that=this
        //页面区
        $('.Snapup').click(function(){
            common.check(that.state.isPreview,'',function(){
                $(".Baopin").addClass("Baopinactive");
            })
        }.bind(that))
        $('.qux').click(function(){
            $(".Baopin").removeClass("Baopinactive");
        })



    }//componentDidUpdate

}
