/*
 * ------------------------------------------------------------------------------
 * 文件名称：bsc_project_def.js 说 明：JavaScript脚本，提供积分方案添加、删除方法和方案考核等级的维护。 版 本：1.0
 * 修改纪录:
 * ------------------------------------------------------------------------------
 * 时间            修改人    说明
 *               zzm      创建
 * ------------------------------------------------------------------------------
 * 
 */
/**
 * 添加方案定义
 */
function addProject() {
	var addPanel = new Ext.FormPanel({
		frame : true,
		url : pathUrl + '/bscProject_common.action?method=addProject',
		layout : 'form',
		border : false,
		split : false,
		labelAlign : 'left',
		bodyStyle : 'padding: 5px',
		labelWidth : 80,
		items : [{
			xtype : 'textfield',
			name : 'project_name',
			emptyText : '请输入方案名称...',
			id : 'project_name',
			allowBlank : false,
			fieldLabel : '方案名称<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			anchor : '95%',
			listeners : {
				blur : function(field){
					Ext.Ajax.request({
						url : pathUrl + '/bscProject_checkNameExist.action',
						method : 'POST',
						params:{project_name : Ext.getCmp('project_name').getValue()},
						callback : function(options,success,response){
							var json = Ext.util.JSON.decode(response.responseText);
							if(json.success){
								field.markInvalid(json.info);
								Ext.getCmp('addSave').setDisabled(true);
							}else{
								Ext.getCmp('addSave').setDisabled(false);
							}
						}
					});
				}
			}
		}, {
			xtype : 'combo',
			mode : 'local',
			displayField : 'cycle_type_desc',
			valueField : 'cycle_type_id',
			hiddenName : 'cycle_type_id',
			store : cycleTypeDS,
			editable : false,
			triggerAction : 'all',
			fieldLabel : '考核周期<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			name : 'cycle_type_id',
			id : 'cycleTypeSelector',
			anchor : '95%'
		}, {
			xtype : 'combo',
			mode : 'local',
			displayField : 'obj_cate_desc',
			valueField : 'obj_cate_id',
			hiddenName : 'obj_cate_id',
			store : objCateDS,
			editable : false,
			triggerAction : 'all',
			fieldLabel : '对象类型<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			name : 'obj_cate_id',
			id : 'objCateSelector',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : dimensionStore,
			valueField : 'link_id',
			displayField : 'link_name',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'obj_link_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '对象维度<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			name : 'obj_link_id',
			id : 'isDimension',			//对象维度
			value : 'N',
			anchor : '95%'
		}, {
			xtype : 'textarea',
			name : 'project_desc',
			id : 'project_desc',
			fieldLabel : '方案备注&nbsp;&nbsp;',
			autoScroll : true,
			height : 80,
			anchor : '95%'
		}]
	});

	var addWindow = new Ext.Window({
		title : '添加方案',
		width : 500,
		height : 400,
		id : 'addWindow',
		layout : 'fit',
		modal : true,
		borer : false,
		listeners : {
			close : function() {
				Ext.getCmp("addWindow").destroy();
			}
		},
		buttonAlign : 'center',
		items : [addPanel],
		buttons : [{
			text : '确定',
			id : 'addSave',
			handler : function() {
				if (addPanel.form.isValid()) {
					addPanel.form.submit({
						waitMsg : '正在处理,请稍后......',
						success : function(form, action) {
//							Ext.Msg.alert("提示信息", action.result.info);
							if (action.result.success) {
								Ext.getCmp("addWindow").destroy();
								projectStore.reload();
							}
						},
						failure : function(form, action) {
							Ext.Msg.alert("提示信息", action.result.info);
						}
					});
				} else {
					Ext.Msg.alert('提示信息', '请输入完整信息');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp("addWindow").destroy();
			}
		}]
	});

	addWindow.show();
	cycleTypeDS.on("load", function() {
		if (cycleTypeDS.getCount() > 0) {
			if (cycleTypeId == '')
				cycleTypeId = cycleTypeDS.getAt(0).get('cycle_type_id');
			Ext.getCmp("cycleTypeSelector").setValue(cycleTypeId);
		}
	});
	cycleTypeDS.load();

	objCateDS.on("load", function() {
		if (objCateDS.getCount() > 0) {
			if (objCateId == '') {
				objCateId = objCateDS.getAt(0).get('obj_cate_id');
			}
			Ext.getCmp("objCateSelector").setValue(objCateId)
		}
	});
	objCateDS.load();
	
	//对象维度
	dimensionStore.on("load", function() {
		if (dimensionStore.getCount() > 0) {
			if (dimensionId == '') {
				dimensionId = dimensionStore.getAt(0).get('link_id');
			}
			Ext.getCmp("isDimension").setValue(dimensionId)
		}
	});
	dimensionStore.load();
	
	if (ownerOrgId != '8888') {
		Ext.getCmp('isTemplate').setDisabled(true);
		Ext.getCmp('isTemplate').setVisible(false);
	}
}
/**
 * 编辑方案
 */
function editProject(record) {

	var editPanel = new Ext.FormPanel({
		frame : true,
		url : pathUrl + '/bscProject_common.action?method=editProject',
		layout : 'form',
		border : false,
		split : false,
		labelAlign : 'left',
		bodyStyle : 'padding: 5px',
		labelWidth : 80,
		items : [{
			xtype : 'textfield',
			name : 'project_name',
			id : 'project_name',
			allowBlank : false,
			fieldLabel : '方案名称',
			anchor : '95%',
			listeners : {
				blur : function(field){
					Ext.Ajax.request({
						url : pathUrl + '/bscProject_checkNameExist.action',
						method : 'POST',
						params:{project_name : Ext.getCmp('project_name').getValue(),
								project_id : projectId},
						callback : function(options,success,response){
							var json = Ext.util.JSON.decode(response.responseText);
							if(json.success){
								field.markInvalid(json.info);
								Ext.getCmp('editSave').setDisabled(true);
							}else{
								Ext.getCmp('editSave').setDisabled(false);
							}
						}
					});
				}
			}
		}, {
			xtype : 'combo',
			mode : 'local',
			displayField : 'cycle_type_desc',
			valueField : 'cycle_type_id',
			hiddenName : 'cycle_type_id',
			store : cycleTypeDS,
			editable : false,
			triggerAction : 'all',
			fieldLabel : '考核周期',
			name : 'cycle_type_id',
			id : 'cycleTypeSelector',
			anchor : '95%'
		}, {
			xtype : 'combo',
			mode : 'local',
			displayField : 'obj_cate_desc',
			valueField : 'obj_cate_id',
			hiddenName : 'obj_cate_id',
			store : objCateDS,
			editable : false,
			triggerAction : 'all',
			fieldLabel : '对象类型',
			name : 'obj_cate_id',
			id : 'objCateSelector',
			anchor : '95%'
		}, {
			xtype : 'combo',
			store : dimensionStore,
			valueField : 'link_id',
			displayField : 'link_name',
			mode : 'local',
			forceSelection : true,
			hiddenName : 'obj_link_id',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			fieldLabel : '对象维度<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
			name : 'obj_link_id',
			id : 'isDimension',			//对象维度
			anchor : '95%'
		}, {
			xtype : 'textarea',
			name : 'project_desc',
			id : 'project_desc',
			fieldLabel : '方案备注',
			autoScroll : true,
			height : 80,
			anchor : '95%'
		}]
	});

	editPanel.getForm().loadRecord(record);
	
	Ext.Ajax.request({
		url : pathUrl + '/bscProject_hasRelation.action?project_id='+projectId,
		method : 'POST',
		callback : function(option,seccess,response){
			var json = Ext.util.JSON.decode(response.responseText);
			if(json.success){
				Ext.getCmp('objCateSelector').readOnly = true;
				Ext.getCmp('objCateSelector').addClass('readOnlyColor');
			}
		}
	});

	var editWindow = new Ext.Window({
		title : '编辑方案',
		width : 500,
		height : 400,
		id : 'editWindow',
		layout : 'fit',
		modal : true,
		borer : false,
		listeners : {
			close : function() {
				Ext.getCmp("editWindow").destroy();
			}
		},
		buttonAlign : 'center',
		items : [editPanel],
		buttons : [{
			text : '确定',
			id : 'editSave',
			handler : function() {
				if (editPanel.form.isValid()) {
					editPanel.form.submit({
						waitMsg : '正在处理,请稍后......',
						params : {
							project_id : projectId
						},
						success : function(form, action) {
//							Ext.Msg.alert("提示信息", action.result.info);
							if (action.result.success) {
								Ext.getCmp("editWindow").destroy();
								projectStore.reload();
								projectId = '';
//								resultRankStore.reload();
							}
						},
						failure : function(form, action) {
							Ext.Msg.alert("提示信息", action.result.info);
						}
					});
				} else {
					Ext.Msg.alert('提示信息', '请输入完整信息');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp("editWindow").destroy();
			}
		}]
	});

	editWindow.show();

	if (ownerOrgId != '8888') {
		Ext.getCmp('isTemplate').setDisabled(true);
		Ext.getCmp('isTemplate').setVisible(false);
	}
}

/**
 * 停用方案
 * @param {} bsc_formula_id
 * @param {} record
 */
function deleteProject() {
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/bscProject_common.action?method=deleteProject',
		params : {
			project_id : projectId
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (success) {
//				Ext.MessageBox.alert("提示信息", json.info);
				projectStore.reload();
				projectId = '';
//				resultRankStore.reload();
			} else {
				Ext.MessageBox.alert("提示信息", json.info);
			}
		}
	});
}

/**
 * 删除方案
 * @param {} bsc_formula_id
 * @param {} record
 */
function dropProject() {
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/bscProject_common.action?method=dropProject',
		params : {
		project_id : projectId
	},
	callback : function(options, success, response) {
		var json = Ext.util.JSON.decode(response.responseText);
		if (json.success) {
//				Ext.MessageBox.alert("提示信息", json.info);
				projectStore.reload();
				projectId = '';
			
//				resultRankStore.reload();
		} else {
			Ext.MessageBox.alert("提示信息", json.info);
		}
	}
	});
}

/**
 * 方案复制
 * @param {} appTypeId
 */
function copyProject(record){
	
	var copyWindow = new Ext.Window({
		id : 'copyWindow',
		title : '复制方案',
		width : 400,
		height : 170,
		layout : 'form',
		modal : true,
		labelWidth : 70,
		border : false,
		bodyStyle : {
				padding : '40px,30px'			
			},
		listeners : {
			close : function(){
				Ext.getCmp("copyWindow").destroy();
			}
		},
		buttonAlign : 'center',
		items : [{
			xtype : 'textfield',
			id : 'copy_project_id',
			fieldLabel : '新方案名称',
			value : record.get('project_name')+'_副本',
			allowBlank : false,
			anchor : '95%'
		}],
		buttons : [{
			text : '确定',
			handler : function(){
				if(Ext.getCmp('copy_project_id').getValue() == null || Ext.getCmp('copy_project_id').getValue() == ''){
					Ext.Msg.alert('提示','请先输入新方案名称!');
					return ;
				}else{
					Ext.Ajax.request({
						method : 'POST',
						url : pathUrl + '/bscProject_common.action?method=copyProject',
						params : {
							old_project_id : record.get('project_id'),
							new_project_name : Ext.getCmp('copy_project_id').getValue()
						},
						callback : function(options,success,response){
							var json = Ext.util.JSON.decode(response.responseText)
							if(success){
								Ext.MessageBox.alert('提示信息',json.info);
								Ext.getCmp("copyWindow").destroy();
								projectStore.reload();
								
							}else{
								Ext.MessageBox.alert('提示信息',json.info);
							}
						}
					});
				}
			}
		},{
			text : '取消',
			handler : function(){
				Ext.getCmp("copyWindow").destroy();
			}
		}]
	});
	
	copyWindow.show();
}

/**
 * 发布、撤回方案
 * @param {} appTypeId：发布状态
 */
function doPublish(appTypeId) {
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/bscProject_common.action?method=doPublish',
		params : {
			project_id : projectId,
			app_type_id : appTypeId
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (success) {
				projectStore.reload();
				projectId = '';
			} else {
				Ext.MessageBox.alert("提示信息", json.info);
			}
		}
	});
}

/**
 * 添加方案考核等级
 */
function addResultRank(lowValue, highValue) {
	var addPanel = new Ext.FormPanel({
		frame : true,
		height : 200,
		id : 'addResultRank',
		url : pathUrl + '/bscProject_common.action?method=addResultRank',
		layout : 'form',
		border : false,
		split : false,
		bodyStyle : 'padding: 15px,5px,15px,5px',
		labelAlign : 'left',
		labelWidth : 75,
		items : [{
			xtype : 'combo',
			mode : 'local',
			displayField : 'rank_short_name',
			valueField : 'proj_rank_id',
			hiddenName : 'proj_rank_id',
			store : bscProjRsltRank,
			editable : false,
			triggerAction : 'all',
			fieldLabel : '等级ID',
			name : 'proj_rank_id',
			id : 'rankIdSelector',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			name : 'score_low',
			id : 'score_low',
			allowBlank : false,
			fieldLabel : '最小值',
			value : lowValue,
			anchor : '95%'
		}, {
			xtype : 'textfield',
			name : 'score_high',
			id : 'score_high',
			fieldLabel : '最大值',
			value : highValue,
			anchor : '95%'
		}]
	});

	var addWindow = new Ext.Window({
		title : '添加参数公式',
		width : 450,
		height : 250,
		id : 'addWindow',
		layout : 'fit',
		modal : true,
		borer : false,
		listeners : {
			close : function() {
				Ext.getCmp("addWindow").destroy();
			}
		},
		buttonAlign : 'center',
		items : [addPanel],
		buttons : [{
			text : '确定',
			handler : function() {
				if (addPanel.form.isValid()) {
					addPanel.form.submit({
						waitMsg : '正在处理,请稍后......',
						params : {
							project_id : projectId
						},
						success : function(form, action) {
//							Ext.Msg.alert("提示信息", action.result.info);
							if (action.result.success) {
								Ext.getCmp("addWindow").destroy();
//								resultRankStore.reload();
							}
						},
						failure : function(form, action) {
							Ext.Msg.alert("提示信息", action.result.info);
						}
					});
				} else {
					Ext.Msg.alert('提示信息', '请输入完整信息');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp("addWindow").destroy();
			}
		}]
	});

	addWindow.show();

	bscProjRsltRank.on("load", function() {
		if (bscProjRsltRank.getCount() > 0) {
			if (rankId == '')
				rankId = bscProjRsltRank.getAt(0).get('proj_rank_id');
			Ext.getCmp("rankIdSelector").setValue(rankId);
		}
	});
	bscProjRsltRank.load();
}

/**
 * 编辑方案考核等级
 * @param {} record
 */
function editResultRank(record) {
	var editPanel = new Ext.FormPanel({
		frame : true,
		height : 200,
		id : 'addParamPanel',
		url : pathUrl + '/bscProject_common.action?method=editResultRank',
		layout : 'form',
		border : false,
		split : false,
		bodyStyle : 'padding: 15px,5px,15px,5px',
		labelAlign : 'left',
		labelWidth : 75,
		items : [{
			xtype : 'textfield',
			name : 'proj_rank_id',
			id : 'proj_rank_id',
			allowBlank : false,
			hidden : true,
			fieldLabel : '等級ID',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			name : 'rank_short_name',
			id : 'rank_short_name',
			allowBlank : false,
			disabled : true,
			fieldLabel : '等級名称',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			name : 'score_low',
			id : 'score_low',
			allowBlank : false,
			fieldLabel : '最小值',
			anchor : '95%'
		}, {
			xtype : 'textfield',
			name : 'score_high',
			id : 'score_high',
			fieldLabel : '最大值',
			anchor : '95%'
		}]
	});

	editPanel.getForm().loadRecord(record);

	var editWindow = new Ext.Window({
		title : '添加参数公式',
		width : 450,
		height : 250,
		id : 'editWindow',
		layout : 'fit',
		modal : true,
		borer : false,
		listeners : {
			close : function() {
				Ext.getCmp("editWindow").destroy();
			}
		},
		buttonAlign : 'center',
		items : [editPanel],
		buttons : [{
			text : '确定',
			handler : function() {
				if (editPanel.form.isValid()) {
					var proj_rank_id = Ext.getCmp('proj_rank_id').getValue();
					editPanel.form.submit({
						waitMsg : '正在处理,请稍后......',
						params : {
							proj_rank_id : proj_rank_id,
							project_id : projectId
						},
						success : function(form, action) {
//							Ext.Msg.alert("提示信息", action.result.info);
							if (action.result.success) {
								Ext.getCmp("editWindow").destroy();
//								resultRankStore.reload();
							}
						},
						failure : function(form, action) {
							Ext.Msg.alert("提示信息", action.result.info);
						}
					});
				} else {
					Ext.Msg.alert('提示信息', '请输入完整信息');
				}
			}
		}, {
			text : '取消',
			handler : function() {
				Ext.getCmp("editWindow").destroy();
			}
		}]
	});

	editWindow.show();

	bscProjRsltRank.on("load", function() {
		if (bscProjRsltRank.getCount() > 0) {
			if (rankId == '')
				rankId = bscProjRsltRank.getAt(0).get('proj_rank_id');
			Ext.getCmp("rankIdSelector").setValue(rankId);
		}
	});
	bscProjRsltRank.load();
}

/**
 * 删除方案考核等级
 * @param {} rankIds
 */
function deleteResultRank(rankIds) {
	Ext.Ajax.request({
		method : 'POST',
		url : pathUrl + '/bscProject_common.action?method=deleteResultRank',
		params : {
			project_id : projectId,
			rankIds : rankIds
		},
		callback : function(options, success, response) {
			var json = Ext.util.JSON.decode(response.responseText);
			if (success) {
//				Ext.MessageBox.alert("提示信息", json.info);
//				resultRankStore.reload();
			} else {
				Ext.MessageBox.alert("提示信息", json.info);
			}
		}
	});
};

 /**
 * 考核周期 00：月 01：季 02：年
 */
function cycleType(val) {
	if (val == '00')
		return '月';
	else if (val == '01')
		return '季'
	else if (val == '02')
		return '年'
	else
		return val
};

 /**
 * 考核对象类型 BM：区属部门 ZJ：镇街 CBM：市属部门
 */
function objCate(val) {
	if (val == 'BM')
		return '区属部门';
	else if (val == 'ZJ')
		return '镇街'
	else if (val == 'CBM')
		return '市属部门';
	else
		return val
};

 /**
 * 方案应用类型 00：发布方案 01：测算方案
 */
function appTypeId(val) {
	if (val == '00')
		return '<span style="color:green;">已发布</span>';
	else if (val == '01')
		return '<span style="color:red;">未发布</span>';
	else
		return val
};

 /**
 * 方案应用类型 Y：是 N：否
 */
/*function isTemplate(val) {
	if (val == 'Y')
		return '方案模板';
	else if (val == 'N')
		return '应用方案'
	else
		return val
};*/