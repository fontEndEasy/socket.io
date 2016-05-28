function createEditer(target_id, widths, heights) {
    var um = UM.getEditor(target_id,{
        initialFrameWidth: widths,     //初始化宽度
        initialFrameHeight: heights,    //初始化高度
        //toolbars :[],             //配置使用工具
        retainOnlyLabelPasted: true,
        pasteplain: true,   //默认是否只用纯文本粘贴
    });
}
