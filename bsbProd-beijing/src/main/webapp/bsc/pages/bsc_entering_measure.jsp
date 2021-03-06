﻿<%@ page language="java" import="java.util.*,com.rx.system.domain.SysUser" contentType="text/html; charset=utf-8" pageEncoding="utf-8" isELIgnored="false"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%
	SysUser user = (SysUser) session.getAttribute("currentUser");
	String ownerOrgId = user.getOwner_org_id();
 %>
<html>
  <head>
    <title>考核系数</title>
    
    <!-- 清理缓存 -->
    <meta http-equiv="pragma" content="no-cache"> 
	<meta http-equiv="cache-control" content="no-cache"> 
	<meta http-equiv="expires" content="0">
	
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/scripts/ext3.4.0/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/icon.css" />
	<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/public/scripts/dhtmlx/dhtmlxtree.css">
	<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/public/css/arrow.css" />
	
	<%@ include file="/skin.jsp"%>

	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/adapter/ext/ext-base.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ext-all.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/locale/ext-lang-zh_CN.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/public/scripts/ext3.4.0/ux/RowExpander.js"></script>
<style>
.x-tree-node .category-node{
    background:#eee;
    margin-top:1px;
    border-top:1px solid #ddd;
    border-bottom:1px solid #ccc;
    padding-top:2px;
    padding-bottom:1px;
}
</style>
</head>

<body topmargin="0">
	<script type="text/javascript">
	
    	var pathUrl = "${pageContext.request.contextPath}";
		var extPath = "${pageContext.request.contextPath}/public/scripts/ext3.4.0";
		Ext.BLANK_IMAGE_URL = extPath + '/resources/images/default/s.gif';
		Ext.QuickTips.init();

		var ownerOrgId = '<%=ownerOrgId%>';
			
		var parameter_id="",parameter_name,obj_cate_id="",obj_cate_desc;
		var paramTypeId = "";
		
		var newWindow = null;
		var weihufangan = "&functionModuleCode=07701";
		var weihucanshuliebiao = "&functionModuleCode=07705";
		var shanchucanshuliebiao =  "&functionModuleCode=07706";	
	</script>
	
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_entering_measure_layout.js"></script>
	<script type="text/javascript" src="${pageContext.request.contextPath}/bsc/scripts/bsc_entering_measure.js"></script>
</body>
</html>
