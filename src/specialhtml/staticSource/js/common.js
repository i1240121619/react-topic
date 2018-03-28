
	// /*写公共的css文件*/
	// document.writeln("<link rel=\"shortcut icon\" href=\"favicon.ico\">");
	// document.writeln("<link href=\"/static/css/bootstrap.min14ed.css?v=3.3.6\" rel=\"stylesheet\">");
	// document.writeln("<link href=\"/static/css/font-awesome.min93e3.css?v=4.4.0\" rel=\"stylesheet\">");
	// document.writeln("<link href=\"/static/css/plugins/bootstrap-table/bootstrap-table.min.css\" rel=\"stylesheet\">");
	// document.writeln("<link href=\"/static/css/animate.min.css\" rel=\"stylesheet\">");
	// document.writeln("<link href=\"/static/css/style.min862f.css?v=4.1.0\" rel=\"stylesheet\">");

	// /*共用的js文件*/
	// document.writeln("<script src=\"/static/js/jquery.min.js?v=2.1.4\"></script>	");
	// document.writeln("<script src=\"/static/js/bootstrap.min.js?v=3.3.6\"></script>");
	// document.writeln("<script src=\"/static/js/openx.js\"></script>");
	// document.writeln("<script src=\"/static/js/plugins/layer/layer.js\"></script>");
	// document.writeln("<script src=\"/static/js/plugins/layer/laytpl.js\"></script> ");

	// //工具条模版
	// document.writeln("<script id=\"TableToolbarTemplate\" type=\"text/html\">");
	// document.writeln("<div class=\"btn-group hidden-xs\"   role=\"group\">");
	// document.writeln("<button type=\"button\" class=\"btn btn-success\" id=\"toolbarAdd\"  onclick=\"$.openx.insertBtn()\"><i class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\">新增</i></button>");
	// document.writeln("<button type=\"button\" class=\"btn btn-info \" id=\"toolbarUpdate\"  onclick=\"$.openx.updateBtn()\"><i class=\"glyphicon glyphicon-pencil\" aria-hidden=\"true\">修改</i></button>");
	// document.writeln("<button type=\"button\" class=\"btn btn-warning \" id=\"toolbarDelete\" onclick=\"$.openx.deleteBtn()\"><i class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\">删除</i></button>");
	// document.writeln("<button type=\"button\" class=\"btn btn-primary\" id=\"toolbarRefush\" onclick=\"$.openx.onloadBtn()\"><i class=\"glyphicon glyphicon-repeat\" aria-hidden=\"true\">刷新</i></button>");
	// document.writeln("</div>");
	// document.writeln("</script>");

	var Util = {};
	Util.formatDate = function (from) { //格式化日期，为2014-02-01形式
	    from = new Date(from);
	    var year = from.getFullYear();
	    var mon = (from.getMonth() + 1) < 10 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1);
	    var day = from.getDate() < 10 ? ('0' + from.getDate()) : from.getDate();
	    var date = year + "-" + mon + "-" + day;
	    return date;
	};

	Util.formatDateSecond = function (from) { //格式化日期，为2014-02-01 10:00:00形式
	    from = new Date(from);
	    var year = from.getFullYear();
	    var mon = (from.getMonth() + 1) < 10 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1);
	    var day = from.getDate() < 10 ? ('0' + from.getDate()) : from.getDate();
	    var h = from.getHours() < 10 ? ('0' + from.getHours()) : from.getHours();
		var m = from.getMinutes() < 10 ? ('0' + from.getMinutes()) : from.getMinutes();
		var s = from.getSeconds() < 10 ? ('0' + from.getSeconds()) : from.getSeconds();
	    var date = year + "-" + mon + "-" + day + " " + h + ":" + m + ":" + s;
	    return date;
	};
	
	Util.formatToTimestamp = function (from) {// 将日期格式转换成毫秒时间戳：
		from = new Date(from).getTime();//'2014-04-23 18:55:49:123'
		return from;
	}

	Util.splitDate = function (from) { //格式化日期，为2014-02-01形式
	    return from.replace(/-/g, ".").split(' ')[0];
	};

	// 复制的时间戳
	Util.formatDateSecond_copy = function (from) { //格式化日期，为2014-02-01 10:00:00形式
	    from = new Date(from);
	    var year = from.getFullYear();
	    var mon = (from.getMonth() + 1) < 10 ? ('0' + (from.getMonth() + 1)) : (from.getMonth() + 1);
	    var day = from.getDate() < 10 ? ('0' + from.getDate()) : from.getDate();
	    var h = from.getHours() < 10 ? ('0' + from.getHours()) : from.getHours();
		var m = from.getMinutes() < 10 ? ('0' + from.getMinutes()) : from.getMinutes();
		var s = from.getSeconds() < 10 ? ('0' + from.getSeconds()) : from.getSeconds();
	    var date = year + "-" + mon + "-" + day + "_" + h + ":" + m + ":" + s;
	    return date;
	};

	/**  
    * 求两个集合的差集  
    
    var a = [1,2,3,4];  
    var b = [3,4,5,6];  
    alert(Array.minus(a,b));
    
    * @param {Array} a 集合A  
    * @param {Array} b 集合B  
    * @returns {Array} 两个集合的差集  
    */  
    // Array.minus = function(a,b){  
    //     return a.uniquelize().each(function(o){return b.contains(o) ? null : o});  
    // };

    //求差集
	function minus_array(arr1,arr2){
	    var arr3 = [];
	    for (var i = 0; i < arr1.length; i++) {
            var flag = true;
            for (var j = 0; j < arr2.length; j++) {
                if (arr2[j] == arr1[i]) {
                    flag = false;
                }
            }
            if (flag) {
                arr3.push(arr1[i]);
            }
        }
		return arr3;
	}


