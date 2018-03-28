import React from 'react';
import update  from 'react-addons-update';
import minicolors  from 'jquery-minicolors';
import QRCode from 'qrcode.react';
import lazyload from 'lazyload'

import Picture from '../components/picture/Picture';
import Video from '../components/video/Video';
import Baopin from '../components/baopin/Baopin';
import UploadPictures from '../components/uploadPictures/UploadPictures';
import Package from '../components/package/Package';


export default class SpecialEdit extends React.Component {
    constructor(props) {
        super(props);

        this.choice= this._choice.bind(this);
        this.videoHeightChange= this._videoHeightChange.bind(this);
        this.showUrl= this._showUrl.bind(this);
        this.choicePic= this._choicePic.bind(this);
        this.moveLeft= this._moveLeft.bind(this);
        this.moveRight= this._moveRight.bind(this);
        this.picCancel= this._picCancel.bind(this);
        this.deletePic= this._deletePic.bind(this);
        this.jumpType= this._jumpType.bind(this);
        this.jumpUrl= this._jumpUrl.bind(this);
        this.showPicLoding= this._showPicLoding.bind(this);
        this.showPic= this._showPic.bind(this);
        this.showPicFail= this._showPicFail.bind(this);
        this.deletePackage= this._deletePackage.bind(this);
        this.addCommodity= this._addCommodity.bind(this);
        this.deleteCommodity= this._deleteCommodity.bind(this);
        this.promotionName= this._promotionName.bind(this);
        this.promotionPrice= this._promotionPrice.bind(this);
        this.commodityCode= this._commodityCode.bind(this);
        this.quantity= this._quantity.bind(this);
        this.deleteHasOwnProperty= this._deleteHasOwnProperty.bind(this);

        //tool.delSession('store');
        console.log("================tool.getSession('store')================")
        console.log(tool.getSession('store'))

        if(tool.getSession('store')){
            this.state=tool.getSession('store')
        }else{
            this.state= {
                id:tool.getQueryString('id')||alert('页面id不能为空'),
                url:tool.href('/specialProject/')+'/specialProject/special/special.html?id='+tool.getQueryString('id'),
                LoadingState:1,//数据是否加载完毕
                activatedPic: 10000,//被激活图片序列号
                activated:10000,//被激活组件序列号
                activatedComponent:'',//被激活组件
                isPreview:1,//是否为预览状态
                loading:0,//loading状态
                openid:tool.getQueryString('openid')||'',
                specialState: {
                    channel:'',
                    activityName:'',
                    LoadingState: 0,//数据是否加载完毕
                    specialData:{},//页面需要的数据
                },//页面页面

            }//state
            this.uploadAjax(this.state.id)
        }//if判断数据来源



    }//constructor

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
                        activityName:dataNew.activityName,
                        LoadingState: 1,//数据是否加载完毕
                        specialData:dataNew
                    },
                })//初始化
            }.bind(this),
            error: function (error) {
                console.log("================error.status================")
                console.log("查询接口--findActivityContent : "+error)
                alert("查询接口--findActivityContent : "+error)

            },
            //timeout: 5000,//超时时间设置，单位毫秒
        });//ajax

    }//uploadAjax

    _choice(val,a){
        if(this.state.activated==val&&!a) return//防止重复渲染
        tool.saveSession('activatedComponent',this.state.specialState.specialData.floorList[val])
        this.setState({
            activated: val,
            activatedPic: 10000,
            activatedComponent:tool.getSession('activatedComponent')
        },function(){
            let activatedComponent=this.state.activatedComponent
            if(this.state.activatedComponent.setType=='page'){
                $('.colorSelection1').minicolors('destroy');
                $('.colorSelection2').minicolors('destroy');
                $('.colorSelection1').minicolors({
                    control: $(this).attr('data-control') || 'hue',
                    defaultValue: activatedComponent.backgroundColor,
                    format: $(this).attr('data-format') || 'hex',
                    keywords: $(this).attr('data-keywords') || '',
                    inline: $(this).attr('data-inline') === 'true',
                    letterCase: $(this).attr('data-letterCase') || 'lowercase',
                    position: $(this).attr('data-position') || 'bottom left',
                    swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
                    change: function (hex) {
                        activatedComponent.backgroundColor = hex
                        this.setState(this.state)
                    }.bind(this),
                    theme: 'default'
                })//minicolors

                $('.colorSelection2').minicolors({
                    control: $(this).attr('data-control') || 'hue',
                    defaultValue: activatedComponent.titleColor,
                    format: $(this).attr('data-format') || 'hex',
                    keywords: $(this).attr('data-keywords') || '',
                    inline: $(this).attr('data-inline') === 'true',
                    letterCase: $(this).attr('data-letterCase') || 'lowercase',
                    position: $(this).attr('data-position') || 'bottom left',
                    swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
                    change: function (hex) {
                        activatedComponent.titleColor = hex
                        this.setState(this.state)
                    }.bind(this),
                    theme: 'default'
                })//minicolors

            }//if page
        })
    }

    delete(){
        let stateNew0= update(this.state,{specialState:{specialData:{floorList:{$splice:[[this.state.activated,1]]}}}});
        let stateNew1= update(stateNew0,{activated:{$set:10000}})
        let stateNew2= update(stateNew1,{activatedComponent:{$set:''}})
        this.setState(stateNew2)
    }

    moveUp(){
        let floorList=this.state.specialState.specialData.floorList
        if(this.state.activated>0){
            let activeComponent=floorList[this.state.activated]
            let activeUpComponent=floorList[this.state.activated-1]
            floorList[this.state.activated-1]=activeComponent
            floorList[this.state.activated]=activeUpComponent
            let specialStateOld=this.state.specialState
            let specialStateNew= update(specialStateOld, {specialData:{floorList:{$set:floorList}}});

            this.setState({
                specialState: specialStateNew,
                activated:this.state.activated-1,//被激活组件序列号
            })

        }else{
            tool.cues({type:"e",txt:'已经到了顶部'})
            return
        }//if判断被激活组件是否在顶部
    }

    moveDown(){
        let floorList=this.state.specialState.specialData.floorList
        let floorListLength=floorList.length
        if(this.state.activated<floorListLength-1){
            let activeComponent=floorList[this.state.activated]
            let activeUpComponent=floorList[this.state.activated+1]
            floorList[this.state.activated+1]=activeComponent
            floorList[this.state.activated]=activeUpComponent
            let specialStateOld=this.state.specialState
            let specialStateNew= update(specialStateOld, {specialData:{floorList:{$set:floorList}}});

            this.setState({
                specialState: specialStateNew,
                activated:this.state.activated+1,//被激活组件序列号
            })

        }else{
            tool.cues({type:"e",txt:'已经到了底部'})
            return
        }//if判断被激活组件是否在底部
    }

    deselect(){
        this.setState({
            activated:10000,//被激活组件序列号，取消选中
        })
    }

    styleType(val){
        let activatedComponent=this.state.activatedComponent
        let mediaList=activatedComponent.mediaList
        if(val==2&&mediaList.length>2){
            tool.cues({type:"e",txt:'不能超过两张图片'})
            return
        }else if(val==3&&mediaList.length>3){
            tool.cues({type:"e",txt:'不能超过三张图片'})
            return
        }//切换样式判断上传图片数量
        activatedComponent.styleType=val
        this.setState({
            activatedComponent: activatedComponent,
        })
    }

    getComponentObj(obj,value){
        for(var i=0;i<obj.length;i++){
            if(obj[i].setType==value){
                return obj[i];
            }
        }
    }

    getDelComponentNewObj(obj,value){
        for(var i=0;i<obj.length;i++){
            if(obj[i].setType==value){
                obj.splice(i,1)
            }
        }
        return obj;
    }

    ensureAajx(floorList){
        if(this.getComponentObj(floorList,'page')){
            let styleList=this.getComponentObj(floorList,'page')
            if(styleList.promotionList.length){
                styleList.promotionList[0].promotionSelected=1
            }
            this.state.specialState.specialData.styleList[0]=styleList//是否更新爆品组件
        }else{
            this.state.specialState.specialData.styleList=[]
        }
        let floorListNew=this.getDelComponentNewObj(floorList,'page')
        this.state.specialState.specialData.floorList=floorListNew
        this.state.specialState.LoadingState=0//设置加载完成状态
        this.setState(this.state)
        let activityModel=this.state.specialState.specialData
        let data={activityModel:activityModel}
        console.log("================updateActivityContent-data================")
        console.log(data)

        tool.wxShopToOpenXAjax({
            url:backendHost+'/colombo/ActivityService/updateActivityContent',
            type: "POST",
            data:data,
            success: function() {
                this.setState({activated:10000})
                tool.cues({type:"s",txt:'更新成功！'})
                this.uploadAjax(this.state.id)
            }.bind(this),
            error: function (error) {
                console.log("================error.status================")
                console.log("更新接口--updateActivityContent : 报错！")
                alert("更新接口--updateActivityContent : 报错！")
            }.bind(this),
            //timeout: 5000,//超时时间设置，单位毫秒
        });//ajax
    }

    ensureYLQ(){
        this.ensure()
    }

    ensure(){
        let setType=this.state.activatedComponent.setType
        if(setType=='pictures'){
            let mediaList=this.state.activatedComponent.mediaList
            let styleType=this.state.activatedComponent.styleType
            if(styleType==1){
                if(!mediaList.length){
                    tool.cues({type:"e",txt:'上传图片不能为空！'})
                    return
                }
                for (var i=0;i<mediaList.length;i++){
                    if(mediaList[i].jumpType!=='3'){
                        tool.cues({type:"e",txt:"图片跳转链接不对"})
                        return
                    }
                }//for
            }else if(styleType==2||styleType==3){
                if((mediaList.length!==2&&styleType==2)||(mediaList.length!==3&&styleType==3)){
                    tool.cues({type:"e",txt:'上传图片数量不对！'})
                    return
                }
                for (var i=0;i<mediaList.length;i++){
                    if(mediaList[i].jumpType=='1'&&mediaList[i].jumpUrl==""){
                        tool.cues({type:"e",txt:"自定义链接不能为空"})
                        return
                    }else if(mediaList[i].jumpType=='1'&&mediaList[i].jumpUrl.substr(0,8)!=="https://"){
                        tool.cues({type:"e",txt:"自定义链接https://开头"})
                        return
                    }
                    if(mediaList[i].jumpType=='2'&&mediaList[i].goodsCode==""){
                        tool.cues({type:"e",txt:"商品编码不能为空"})
                        return
                    }else if((mediaList[i].jumpType=='2'&&mediaList[i].goodsCode.toString().length!==7)||(mediaList[i].jumpType=='2'&&isNaN(mediaList[i].goodsCode))){
                        tool.cues({type:"e",txt:"商品编码应为7位数字"})
                        return
                    }
                }//for
            }//判断样式
        }//判断pictures组件

        if(setType=='videos'){
            let mediaList=this.state.activatedComponent.mediaList
            if(mediaList[0].height==""){
                tool.cues({type:"e",txt:'视频高度不能为空！'})
                return
            }else if(mediaList[0].showUrl==""){
                tool.cues({type:"e",txt:'视频地址不能为空！'})
                return
            }
        }//判断videos组件

        if(setType=='page'){
            let activatedComponent=this.state.activatedComponent
            let buttonType=activatedComponent.buttonType
            let promotionList=activatedComponent.promotionList
            if(buttonType==1){
                if(activatedComponent.backgroundColor==""){
                    tool.cues({type:"e",txt:"按钮背景颜色不能为空"})
                    return
                }else if(activatedComponent.buttonTitle==""){
                    tool.cues({type:"e",txt:"按钮标题不能为空"})
                    return
                }else if(activatedComponent.titleColor==""){
                    tool.cues({type:"e",txt:"按钮字体颜色不能为空"})
                    return
                }
            }else{
                if(activatedComponent.buttonPicUrl==""){
                    tool.cues({type:"e",txt:"按钮背景图片不能为空"})
                    return
                }
            }

            if(!promotionList.length){
                tool.cues({type:"e",txt:"至少有一个套餐"})
                return
            }

            for (var i=0;i<promotionList.length;i++){
                if(promotionList[i].promotionName==""){
                    tool.cues({type:"e",txt:"套餐名称不能为空"})
                    return
                }
                if(promotionList[i].promotionPrice==""){
                    tool.cues({type:"e",txt:"套餐价格不能为空"})
                    return
                }

                for (var ii=0;ii<promotionList[i].promotionDetailList.length;ii++){
                    if(promotionList[i].promotionDetailList[ii].goodsCode==""){
                        tool.cues({type:"e",txt:"商品编码不能为空"})
                        return
                    }else if(promotionList[i].promotionDetailList[ii].goodsCode.toString().length!==7){
                        tool.cues({type:"e",txt:"商品编码应为7位数字"})
                        return
                    }
                    if(promotionList[i].promotionDetailList[ii].quantity==""){
                        tool.cues({type:"e",txt:"商品数量不能为空"})
                        return
                    }
                }

            }

        }//判断page组件
        let floorList=this.state.specialState.specialData.floorList
        if(this.state.activated!==10000) floorList[this.state.activated]=this.state.activatedComponent//是否更新楼层组件
        this.ensureAajx(floorList)
    }

    cancel(){
        this._choice(this.state.activated,1)
    }

    addComponent(val,anchorName){
        if(anchorName) {
            let anchorElement = document.getElementById(anchorName);
            if(anchorElement) { anchorElement.scrollIntoView(); }
        }
        if(val=='pictures'){
            let pictures={
                activityFloorNum: 0,
                setType:'pictures',
                styleType:1,
                mediaList:[{default:1,showType:"0",jumpUrl:"",goodsCode:"",showUrl:"images/default_banner.png",width:750,height:340,showName:'default_banner.png',jumpType:'3'}]
            }
            var stateNew= update(this.state,{specialState:{specialData:{floorList:{$push:[pictures]}}}});

            this.setState(stateNew,function(){
                this._choice(this.state.specialState.specialData.floorList.length-1)
            })

        }else if(val=='goods'){
            tool.cues({type:"e",txt:'尚未开通'})
            return
        }else if(val=='page'){
            let floorList=this.state.specialState.specialData.floorList
            if(this.getComponentObj(floorList,'page')){
                tool.cues({type:"e",txt:'此组件已经存在了'})
                return
            }

            let page={
                "setType": "page",
                "titleColor": "#ffffff",
                "backgroundColor": "#ff9e33",
                "titleSize": "18",
                "buttonPicUrl": "",
                "buttonTitle": "立即抢购",
                "buttonType": "1",
                "promotionList": [

                ]
            }
            var stateNew= update(this.state,{specialState:{specialData:{floorList:{$push:[page]}}}});

            this.setState(stateNew,function(){
                this._choice(this.state.specialState.specialData.floorList.length-1)
            })
        }else if(val=='videos'){
            let videos={
                activityFloorNum: 0,
                setType:'videos',
                mediaList:[{showUrl:"",height:240}]
            }
            var stateNew= update(this.state,{specialState:{specialData:{floorList:{$push:[videos]}}}});

            this.setState(stateNew,function(){
                this._choice(this.state.specialState.specialData.floorList.length-1)
            })
        }

    }

    _videoHeightChange(e){
        let height = e.target.value
        let mediaList=this.state.activatedComponent.mediaList
        mediaList[0].height=height
        this.setState(this.state)
    }

    _showUrl(e){
        let showUrl = e.target.value
        let mediaList=this.state.activatedComponent.mediaList
        mediaList[0].showUrl=showUrl
        this.setState(this.state)
    }

    _choicePic(val){
        this.setState({
            activatedPic: val,
        })
    }


    _moveLeft(){
        let mediaList=this.state.activatedComponent.mediaList

        if(this.state.activatedPic>0){
            let activePic=mediaList[this.state.activatedPic]
            let activeLeftPic=mediaList[this.state.activatedPic-1]
            mediaList[this.state.activatedPic-1]=activePic
            mediaList[this.state.activatedPic]=activeLeftPic

            this.setState({
                specialState: this.state.specialState,
                activatedPic:this.state.activatedPic-1,//被激活组件序列号
            })

        }else{
            tool.cues({type:"e",txt:'已经到了第一个'})
            return
        }//if判断被激活组件是否在第一个
    }

    _moveRight(){
        let mediaList=this.state.activatedComponent.mediaList
        let mediaListLength=mediaList.length
        if(this.state.activatedPic<mediaListLength-1){
            let activePic=mediaList[this.state.activatedPic]
            let activeLeftPic=mediaList[this.state.activatedPic+1]
            mediaList[this.state.activatedPic+1]=activePic
            mediaList[this.state.activatedPic]=activeLeftPic

            this.setState({
                specialState: this.state.specialState,
                activatedPic:this.state.activatedPic+1,//被激活组件序列号
            })

        }else{
            tool.cues({type:"e",txt:'已经到了最后一个'})
            return
        }//if判断被激活组件是否在最后一个

    }

    _picCancel(){
        this.setState({
            activatedPic:10000,//取消被激活图片
        })
    }


    _deletePic(val){
        let stateNew0= update(this.state,{activatedComponent:{mediaList:{$splice:[[val,1]]}}});
        let stateNew1= update(stateNew0,{activatedPic:{$set:10000}})
        this.setState(stateNew1)
    }

    _jumpType(val,index){
        this.state.activatedComponent.mediaList[index].jumpType=val
        this.state.activatedComponent.mediaList[index].jumpUrl=''
        this.state.activatedComponent.mediaList[index].goodsCode=''
        this.setState(this.state)
    }

    _jumpUrl(val,index,jumpType){
        if(jumpType=='1'){
            this.state.activatedComponent.mediaList[index].jumpUrl=val
            this.state.activatedComponent.mediaList[index].goodsCode=''
        }else if(jumpType=='2'){
            this.state.activatedComponent.mediaList[index].jumpUrl=''
            this.state.activatedComponent.mediaList[index].goodsCode=val
        }else{
            this.state.activatedComponent.mediaList[index].jumpUrl=''
            this.state.activatedComponent.mediaList[index].goodsCode=''
        }

        this.setState(this.state)
    }

    _showPicLoding(a){
        let mediaList=this.state.activatedComponent.mediaList
        if(this.state.activatedPic==10000){
            let mediaListNew = mediaList.concat(a)
            this.state.activatedComponent.mediaList=mediaListNew
            this.setState(this.state)

        }else{
            mediaList[this.state.activatedPic]=a[0]
            this.setState(this.state)
        }//判断操作类型

    }

    _showPic(a,b){
        let mediaList=this.state.activatedComponent.mediaList
        if(this.state.activatedPic==10000){
                if(b>=mediaList.length) return
                mediaList[b].showUrl=a
                this.setState(this.state)
        }else{
            mediaList[this.state.activatedPic].showUrl=a
            this.setState(this.state)
        }//判断操作类型

    }

    _showPicFail(a){
        let mediaList=this.state.activatedComponent.mediaList
        mediaList[a].showUrl='images/error.png'
        this.setState(this.state)
    }

    _deleteHasOwnProperty(a){
        let mediaList=this.state.activatedComponent.mediaList
        for(var i = 0; i < mediaList.length; i++){
            if(mediaList[i].hasOwnProperty(a)){
                mediaList.splice(i,1)
            }
        }
        this.setState(this.state)
    }

    buttonType(val){
        let activatedComponent=this.state.activatedComponent
        activatedComponent.buttonType=val
        this.setState(this.state)
    }

    buttonTitle(e){
        let buttonTitle = e.target.value//获取输入框文字
        let activatedComponent=this.state.activatedComponent
        activatedComponent.buttonTitle=buttonTitle
        this.setState(this.state)
    }

    backgroundColor(e){
        let backgroundColor = e.target.value//获取输入框文字
        let activatedComponent=this.state.activatedComponent

        activatedComponent.backgroundColor=backgroundColor
        this.setState(this.state)
    }
    titleColor(e){
        let titleColor = e.target.value//获取输入框文字
        let activatedComponent=this.state.activatedComponent
        activatedComponent.titleColor=titleColor
        this.setState(this.state)
    }

    getimgsrc(){
        return
    }

    picValidateInit(event){
        event.target.value=''
    }

    picValidate(a,event) {
        event.preventDefault()
        let target = event.target
        let files = target.files
        let count = files.length

        for(var i = 0; i < count; i++) {
            files[i].thumb = URL.createObjectURL(files[i])
        }
        files = Array.prototype.slice.call(files,0)
        if(a==1){//判断是图片还是视频
            var size=500000
            var smtxt='单张图不能超过500kb！'
        }else if(a==2){
            var size=524288000
            var smtxt='单个视频不能超过500M！'
        }
        for(var i=0;i<files.length;i++){
            if(files[i].size>size){
                tool.cues({type:"e",txt:smtxt})
                return
            }
        }//for files
        this.setState({loading:1})
        this.findFileKey(files[0].name,files[0],a)//上传函数

    }//picValidate

    findFileKey(fileName,files,a){
        let data={fileName:fileName}
        tool.wxShopToOpenXAjax({
            url:backendHost+'/openx/colombo/ActivityService/uploadFile',
            type: "GET",
            data:data,
            success: function(data) {
                let url1=data.host
                let url=url1.replace("http:","https:")
                let picUrl=url+'/'+data.key
                let form = new FormData()
                let formdata={
                    OSSAccessKeyId:data.accessID,
                    signature:data.signature,
                    key:data.key,
                    expire:data.expire,
                    policy:data.policy,
                    file:files
                }
                $.each(formdata,function(a){
                    form.append(a,formdata[a])
                })
                $.ajax({
                    url:url,
                    type: "POST",
                    dataType: "json",
                    data:form,
                    processData:!1,
                    contentType:!1,
                    success: function() {
                        if(a==1){
                            this.buttonPicUrl(picUrl)
                        }else if(a==2){
                            this.buttonVideoUrl(picUrl)
                        }
                        tool.cues({type:"s",txt:'上传成功'})
                        this.setState({loading:0})
                        console.log("================host--data================")
                        console.log('上传成功！')
                    }.bind(this),
                    error: function (error) {
                        if(a==1){
                            this.buttonPicUrl('上传失败')
                        }else if(a==2){
                            this.buttonVideoUrl('上传失败')
                        }
                        tool.cues({type:"e",txt:'上传失败'})
                        console.log("================error.status================")
                        console.log("上传图片接口--host : "+error)
                    }.bind(this),
                    //timeout: 5000,//超时时间设置，单位毫秒
                });//ajax

            }.bind(this),
            error: function (error) {
                console.log("================error.status================")
                console.log("上传验证接口--ActivityService : "+error)
                alert("上传验证接口--ActivityService : "+error)

            },
            //timeout: 5000,//超时时间设置，单位毫秒
        });//ajax

    }

    buttonPicUrl(a){
        let activatedComponent=this.state.activatedComponent
        activatedComponent.buttonPicUrl=a
        this.setState(this.state)
    }

    buttonVideoUrl(a){
        let activatedComponent=this.state.activatedComponent
        let mediaList=activatedComponent.mediaList
        mediaList[0].showUrl=a
        this.setState(this.state)
    }

    titleSize(e){
        var titleSize=e.target.value
        let activatedComponent=this.state.activatedComponent
        activatedComponent.titleSize=titleSize
        this.setState(this.state)
    }

    addPackage() {
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        let packageMb = {promotionDetailList:[{goodsCode:'',quantity:''}],promotionName:'', promotionPrice:'',promotionSelected:0,promotionNum:1}
        promotionList.push(packageMb)
        this.setState(this.state)
    }

    _deletePackage(a){
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        promotionList.splice(a,1)
        this.setState(this.state)
    }

    _addCommodity(a){
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        let promotionDetailList=promotionList[a].promotionDetailList
        let commodityMb ={goodsCode:'',quantity:''}
        promotionDetailList.push(commodityMb)
        this.setState(this.state)
    }

    _deleteCommodity(a,b){
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        let promotionDetailList=promotionList[a].promotionDetailList
        if(promotionDetailList.length==1){
            tool.cues({type:"e",txt:'至少有一个商品'})
            return
        }
        promotionDetailList.splice(b,1)
        this.setState(this.state)
    }

    _promotionName(a,b){
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        promotionList[a].promotionName=b
        this.setState(this.state)
    }

    _promotionPrice(a,b){
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        promotionList[a].promotionPrice=b
        this.setState(this.state)
    }

    _commodityCode(a,b,c){
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        let promotionDetailList=promotionList[a].promotionDetailList
        promotionDetailList[b].goodsCode=c
        this.setState(this.state)
    }

    _quantity(a,b,c){
        let activatedComponent = this.state.activatedComponent
        let promotionList=activatedComponent.promotionList
        let promotionDetailList=promotionList[a].promotionDetailList
        promotionDetailList[b].quantity=c
        this.setState(this.state)
    }

    render() {
        let specialState=this.state.specialState
        let specialData=specialState.specialData
        let floorList=specialData.floorList
        let activatedComponent=this.state.activatedComponent

        if(this.state.activated!==10000&&activatedComponent.setType=='pictures'){
            var styleType=activatedComponent.styleType//图片组件图片排版切换
        }else if(this.state.activated!==10000&&activatedComponent.setType=='page'){
            var buttonType=activatedComponent.buttonType//爆品组件按钮样式切换
            var backgroundColor=activatedComponent.backgroundColor
            var titleColor=activatedComponent.titleColor
            var buttonTitle=activatedComponent.buttonTitle
            var buttonPicUrl=activatedComponent.buttonPicUrl
            var titleSize=activatedComponent.titleSize
            var promotionList=activatedComponent.promotionList

        }else if(this.state.activated!==10000&&activatedComponent.setType=='videos'){
            var mediaList=activatedComponent.mediaList
            var showUrl=mediaList[0].showUrl
            var height=mediaList[0].height
        }
        console.log("+++++++++++++this.state.specialState.specialData+++++++++++++")
        console.log(this.state.specialState.specialData)

        console.log("+++++++++++++activatedComponent+++++++++++++")
        console.log(activatedComponent)
        return (
            <div className="mainInAll">
                <div className={this.state.LoadingState?"main mainIn":"main"}>
                    <div className="leftBar">
                        <ul className="">
                            <li onClick={this.addComponent.bind(this,'pictures','foot')} className={this.state.activatedComponent.setType=='pictures'&&this.state.activated!==10000?"active":""}><img src="images/icon_1.png"/>图片</li>
                            <li onClick={this.addComponent.bind(this,'goods','foot')} className={this.state.activatedComponent.setType=='goods'&&this.state.activated!==10000?"active":""?"active":""}><img src="images/icon_2.png"/>楼层图片</li>
                            <li onClick={this.addComponent.bind(this,'page','foot')} className={this.state.activatedComponent.setType=='page'&&this.state.activated!==10000?"active":""?"active":""}><img src="images/icon_3.png"/>爆品抢购<br/>（免登录）</li>
                            <li onClick={this.addComponent.bind(this,'videos','foot')} className={this.state.activatedComponent.setType=='videos'&&this.state.activated!==10000?"active":""?"active":""}><img src="images/icon_4.png"/>视频</li>
                        </ul>
                    </div>
                    <div className="main_center">
                        <div className="MobilePhone">
                            <div className="Title">{this.state.specialState.activityName}</div>
                            <div className="MobileScreen">
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
                                                            <Baopin openid={this.state.openid} channel={this.state.specialState.channel} activityName={this.state.specialState.activityName} isPreview={this.state.isPreview} activated={this.state.activated} action={this.choice} serialNumber={index} key={index} data={specialData.floorList[index]}/>
                                                        )
                                                    }else if(item.setType=="videos"){
                                                        return (
                                                            <Video isPreview={this.state.isPreview} activated={this.state.activated} action={this.choice} serialNumber={index} key={index} data={specialData.floorList[index]}/>
                                                        )
                                                    }

                                                }):null}
                                                <div id="foot"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={this.state.activated==10000?"EditComponent hide":"EditComponent"}>
                                <a href="javascript:void(0)" onClick={this.delete.bind(this)}>删除</a>
                                <a href="javascript:void(0)" onClick={this.moveUp.bind(this)}>上移</a>
                                <a href="javascript:void(0)" onClick={this.moveDown.bind(this)}>下移</a>
                                <a href="javascript:void(0)" onClick={this.deselect.bind(this)}>取消选中</a>
                            </div>

                            <div className="SavePage">
                                <a href="javascript:void(0)" onClick={this.ensureYLQ.bind(this)}>保存页面</a>
                                <a href="javascript:void(0)" className="baocun">预览页面</a>
                            </div>
                        </div>
                    </div>
                    <div className={this.state.activated==10000?"rightBar hide":"rightBar"}>

                        <div className={this.state.activatedComponent.setType=='pictures'?"img":"img hide"}>
                            <h4 className="head padding-15">组件属性编辑[图片]</h4>
                            <div className="content padding-20">

                                <div className="line">
                                    <span className="pull-left title">样式</span>
                                        <span className="pull-left input_box">
                                            <label><input type="radio" name="goodsource" checked={styleType==1?"checked":""}  onChange={this.styleType.bind(this,1)}/><span className="title">一行一张</span></label>
                                            <label><input type="radio" name="goodsource" checked={styleType==2?"checked":""}  onChange={this.styleType.bind(this,2)}/><span className="title">一行两张</span></label>
                                            <label><input type="radio" name="goodsource" checked={styleType==3?"checked":""}  onChange={this.styleType.bind(this,3)}/><span className="title">一行三张</span></label>
                                        </span>
                                </div>
                                {(()=>{
                                    if(this.state.activatedComponent.styleType){
                                        return (
                                            <UploadPictures activatedComponent={this.state.activatedComponent} activatedPic={this.state.activatedPic} action={this.choicePic} moveLeft={this.moveLeft} moveRight={this.moveRight} picCancel={this.picCancel} deletePic={this.deletePic} jumpType={this.jumpType} jumpUrl={this.jumpUrl} showPicLoding={this.showPicLoding} showPic={this.showPic} showPicFail={this.showPicFail} deleteHasOwnProperty={this.deleteHasOwnProperty}/>
                                        )
                                    }
                                })()}

                            </div>

                        </div>

                        <div className="goods" style={{display:'none'}}>
                            <h4 className="head padding-15">组件属性编辑[商品楼层]</h4>
                            <div className="content padding-20">
                                <div className="line">
                                    <span className="pull-left title">位置</span>
                            <span className="pull-left input_box">
                                    <input type="text" className="form-control width-80"/><br/>
                                    <p className="text-center">x</p>
                            </span>
                            <span className="pull-left input_box">
                                    <input type="text" className="form-control width-80"/><br/>
                                    <p className="text-center">y</p>
                            </span>
                                </div>
                                <div className="line">
                                    <span className="pull-left title">背景颜色</span>
                            <span className="pull-left input_box">
                                <input type="text" className="form-control width-80"/>
                            </span>
                                </div>

                                <div className="line">
                                    <span className="pull-left title">楼层标题</span>
                            <span className="pull-left input_box">
                                <input type="text" className="form-control width-300"/>
                            </span>
                                </div>

                                <div className="line">
                                    <span className="pull-left title">标题大小</span>
                            <span className="pull-left input_box">
                                <select className="form-control width-80">
                                    <option>30</option>
                                    <option>25</option>
                                    <option>20</option>
                                    <option>15</option>
                                </select>
                            </span>
                                </div>

                                <div className="line">
                                    <span className="pull-left title">商品来源</span>
                            <span className="pull-left input_box">
                                <label><input type="radio" name="goodsource1" defaultChecked="defaultChecked"/><span className="title">商品编码</span></label>
                                <label><input type="radio" name="goodsource1"/><span className="title">促销系统</span></label>
                            </span>
                                    <button type="button" className="btn btn-success">导入商品</button>
                                </div>

                                <div className="goodslist">
                                    <div className="goodcodes">
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[1]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[2]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[3]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[4]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[5]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[6]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[7]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">商品编码<span>[8]</span></h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                    </div>
                                    <div className="promotionid">
                                        <div className="goods_item">
                                            <h4 className="goods_item_title">促销ID</h4>
                                            <input type="text" className="full-width form-control"/>
                                        </div>
                                    </div>

                                    <div className="goods_item">
                                        <h4 className="goods_item_title">样式</h4>
                                <span className="input_box">
                                    <label><input type="radio" name="ddd" defaultChecked="defaultChecked"/><span className="title">轮播</span></label>
                                    <label><input type="radio" name="ddd"/><span className="title">平铺</span></label>
                                    <label><input type="radio" name="ddd"/><span className="title">仅一行</span></label>
                                </span>
                                    </div>
                                    <div className="goods_item">
                                        <h4 className="goods_item_title">排列</h4>
                                <span className="input_box">
                                    <label><input type="radio" name="ccc" defaultChecked="defaultChecked"/><span className="title">一行两个</span></label>
                                    <label><input type="radio" name="ccc"/><span className="title">一行三个</span></label>
                                </span>
                                    </div>

                                </div>

                            </div>

                            <div className="padding-10 text-center bottom_btn_box full-width">
                                <button type="button" className="btn btn-default">取消</button>
                                <button type="button" className="btn btn-success">确定</button>
                            </div>
                        </div>

                        <div className="hot" className={this.state.activatedComponent.setType=='page'?"hot":"hot hide"}>
                            <h4 className="head padding-15">组件属性编辑[爆品抢购]</h4>
                            <h6 className="head2 padding-15">按钮属性设置</h6>
                            <div className="content padding-20">
                                <div className="line">
                                    <span className="pull-left title">按钮样式</span>
                                        <span className="pull-left input_box">
                                            <label><input type="radio" name="goodsource2" checked={buttonType==1?"checked":""} onChange={this.buttonType.bind(this,1)}/><span className="title">自定义按钮</span></label>
                                            <label><input type="radio" name="goodsource2" checked={buttonType==2?"checked":""} onChange={this.buttonType.bind(this,2)}/><span className="title">上传按钮图片</span></label>
                                        </span>
                                </div>
                                <div className={this.state.activatedComponent.buttonType=='1'?"show":"hide"}>
                                    <div className="line yanse">
                                        <span className="pull-left title">背景颜色</span>
                                        <span className="pull-left input_box">
                                            <input type="text" className="form-control width-80 colorSelection1" data-control="hue" size="7"  value={backgroundColor||''} onChange={this.backgroundColor.bind(this)}/>
                                        </span>
                                        <div className="c"></div>
                                    </div>

                                    <div className="line">
                                        <span className="pull-left title">按钮标题</span>
                                        <span className="pull-left input_box">
                                            <input type="text" className="form-control width-300" value={buttonTitle||''} onChange={this.buttonTitle.bind(this)}/>
                                        </span>
                                    </div>

                                    <div className="line yanse">
                                        <span className="pull-left title">标题颜色</span>
                                        <span className="pull-left input_box">
                                            <input type="text" className="form-control width-80 colorSelection2" data-control="hue" size="7" value={titleColor||''} onChange={this.titleColor.bind(this)}/>
                                        </span>
                                        <div className="c"></div>
                                    </div>

                                    <div className="line">
                                        <span className="pull-left title">标题大小</span>
                                        <span className="pull-left input_box">
                                            <select className="form-control width-80" value={titleSize} onChange={this.titleSize.bind(this)}>
                                                <option>18</option>
                                                <option>16</option>
                                                <option>14</option>
                                                <option>12</option>
                                            </select>
                                        </span>
                                    </div>
                                </div>

                                <div className={this.state.activatedComponent.buttonType=='2'?"line show":"line hide"}>
                                    <span className="pull-left title">按钮图片</span>
                                    <div>
                                        <input type="text" className="pull-left width-250 form-control" value={buttonPicUrl||''} onChange={this.getimgsrc}/>
                                        <div className="pull-left">
                                            <div className="picsc">
                                                <input type="file" className="fileInput" accept=".jpg,.gif,.png" multiple='false' onClick={this.picValidateInit.bind(this)} onChange={this.picValidate.bind(this,1)}/>
                                                <div className={this.state.loading?"btn btn-success hide":"btn btn-success show"}>上传</div>
                                                <div className={this.state.loading?"btn btn-success scloading show":"btn btn-success scloading hide"}>
                                                    <div className="spinner">
                                                        <div className="rect1"></div>
                                                        <div className="rect2"></div>
                                                        <div className="rect3"></div>
                                                        <div className="rect4"></div>
                                                        <div className="rect5"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h6 className="head2 padding-15 taocantj">套餐设置<button type="button" className="btn btn-success pull-right taocantjbtn" onClick={this.addPackage.bind(this)}>添加套餐</button></h6>
                            <div className="content padding-20">
                                {promotionList ? promotionList.map((item, index)=> {
                                    return (
                                        <Package data={item} serialNumber={index} key={index} deletePackage={this.deletePackage} addCommodity={this.addCommodity} deleteCommodity={this.deleteCommodity} promotionName={this.promotionName} promotionPrice={this.promotionPrice} commodityCode={this.commodityCode} quantity={this.quantity}/>
                                    )
                                }):null}
                            </div>

                        </div>

                        <div className={this.state.activatedComponent.setType=='videos'?"video":"video hide"}>
                            <h4 className="head padding-15">组件属性编辑[视频]</h4>
                            <div className="content padding-20">
                                <div className="line">
                                    <span className="pull-left title">高度</span>
                                    <span className="pull-left input_box">
                                        <input type="number" name="height" className="form-control width-80" value={height||''} onChange={this.videoHeightChange.bind(this)}/>
                                    </span>
                                </div>
                                <div className='line show'>
                                    <span className="title">视频地址</span><br/>
                                    <div>
                                        <input type="text" className="pull-left width-300 form-control" value={showUrl||''} onChange={this.showUrl.bind(this)}/>
                                        <div className="pull-left">
                                            <div className="picsc">
                                                <input type="file" className="fileInput" accept=".mp4" multiple='false' onClick={this.picValidateInit.bind(this)} onChange={this.picValidate.bind(this,2)}/>
                                                <div className={this.state.loading?"btn btn-success hide":"btn btn-success show"}>上传</div>
                                                <div className={this.state.loading?"btn btn-success scloading show":"btn btn-success scloading hide"}>
                                                    <div className="spinner">
                                                        <div className="rect1"></div>
                                                        <div className="rect2"></div>
                                                        <div className="rect3"></div>
                                                        <div className="rect4"></div>
                                                        <div className="rect5"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="padding-10 text-center bottom_btn_box full-width">
                            <button type="button" className="btn btn-default" onClick={this.cancel.bind(this)}>取消</button>
                            <button type="button" className="btn btn-success queding" onClick={this.ensure.bind(this)}>确定</button>
                        </div>


                    </div>
                    <div className="zhezhaobj hide">
                        <div className="nrbjbs">
                            <div className="nrbj">
                                <div className="nrzjbj">
                                    <QRCode value={this.state.url} size={240}/>
                                    <div className="urlsjbj">手机扫码预览</div>
                                    <div className="urlbj"><a target="_blank" href={this.state.url}>在PC端浏览器中打开</a></div>
                                </div>
                                <div className="gbbj yf_close"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )

    }//render

    componentDidUpdate(){

        //页面区
        $("img.lazy").lazyload({
            effect: "fadeIn",
            threshold : 20,
            skip_invisible : false,
        });
        var height=$('.MobileScreen').height()
        $(".MobileScreenposition").css("height", height+"px");

        function positionFooter() {
            var scrollTop= $('.MobileScreenposition').scrollTop();
            $(".Baopin").css({ position: "absolute",bottom:'-'+scrollTop+'px' });
        }

        $('.MobileScreenposition').scroll(positionFooter).resize(positionFooter);
        $('.Snapup').click(function(){
            $(".MobileScreenposition").css("overflow-y", "hidden");
            $(".Baopin").addClass("Baopinactive");
        })
        $('.qux').click(function(){
            $(".MobileScreenposition").css("overflow-y", "scroll");
            $(".Baopin").removeClass("Baopinactive");
        })

        //编辑区
        $('.queding').on("click",positionFooter);
        $('.gbbj').on("click",function(){
            $(".zhezhaobj").removeClass("show");
            $('.zhezhaobj').addClass("hide");
        });
        $('.baocun').on("click",function(){
            $(".zhezhaobj").removeClass("hide");
            $('.zhezhaobj').addClass("show");
        });


    }//componentDidUpdate

}