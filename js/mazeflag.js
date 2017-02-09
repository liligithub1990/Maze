function getPos(obj){
	var l=0;
	var t=0;
	while(obj){
		l+=obj.offsetLeft;
		t+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return {left:l, top:t};
};
function getByClass(oParent,sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
		sClass=sClass.replace(/^\s+|\s+$/g,'');
		var reg=new RegExp('\\b'+sClass+'\\b');
		var arr=[];
		var aEle=oParent.getElementsByTagName('*');
		for(var i=0; i<aEle.length; i++){
			if(reg.test(aEle[i].className)){
				arr.push(aEle[i]);  
			}
		}
		return arr;
	}
};
function addHandler(a,c,b){        /*公共函数：绑定事件*/
	if(a==null)return;if(a.addEventListener){addHandler=function(d,f,e){if(d==null)return;d.addEventListener(f,e,false)}}else{if(a.attachEvent){addHandler=function(d,f,e){if(d==null)return;d.attachEvent("on"+f,e)}}else{addHandler=function(d,f,e){if(d==null)return;d["on"+f]=e}}}addHandler(a,c,b)
};
//删除事件处理程序
function removeHandler(element,type,handler){
	if(element.removeEventListener){    // !IE
		element.removeEventListener(type,handler,false);
	} else if(element.detachEvent){ // IE
		element.detachEvent('on'+type,handler,false);
	} else {    //DOM0级
		element['on'+type] = null;
	}
}
//创建二维数组
function multiArray(m,n) {
	var arr =  new Array(n);
	for(var i=0; i<m; i++) 
		arr[i] = new Array(m);
	return arr;
};
function Maze(options){
	this.opts = {
		divW : 0,
		rowCount : 0,
		colCount : 0,
	};
	
	this.inited = false;
	this.init = function(){
		this.nodes = [];
		for (var y=0; y<this.size[1]; y++){
			this.nodes[y] = [];
			for (var x=0; x<this.size[0]; x++){
				this.nodes[y][x] = new Node(this, x, y);
			}
		}
		this.inited = true;
	}
	this.get_node = function(x,y){
		return this.inited && x >=0 && x < this.size[0] && y >= 0 && y < this.size[1] && this.nodes[y][x];
	}
	this.create = function(){
		this.setOptions(options);
		this.size = [this.opts.colCount,this.opts.rowCount];
		this.way = multiArray(this.opts.divW,this.opts.divW);//单元格对象
		if (!this.inited) this.init();
		var try_count = 0;
		var points = [];
		var most_rightbottom_point = this.nodes[0][0];
		var cp;
		points.push(this.nodes[0][0]);

		while(points.length > 0){
			var np = random_init_cell(cp = points.pop());
			if (cp.x >= most_rightbottom_point.x && cp.y >= most_rightbottom_point.y) most_rightbottom_point = cp;
			for (var i=0; i<np.length; i++) points.unshift(np[i]);
			if (points.length == 0 && !this.nodes[this.size[1]-1][this.size[0]-1].inited && ++try_count < 1000){
				most_rightbottom_point.inited = false;
				points.push(most_rightbottom_point);

			}
		}
		function random_init_cell(p){
			if (p.inited) return [];
			var re = [];
			for (var i=0, dir; i<Maze.DIR.length && (dir = Maze.DIR[i]); i++){
				if (p[dir]() && !p.dir[dir] && Math.random() < ratio(dir, p)){
					p.open(dir);
					re.push(p[dir]());
				}
			}
			p.inited = true;
			return re;
		}
		function ratio(dir, p){
			var c = p.branches_count()*0.5 + p[dir]().branches_count() * 10;
			return Math.pow(0.4,c);
		}
		
	}
	this.constructor = Maze;
	this.setOptions  = function(options){
		var _this = this;
		(function(){for(var i in options){
			_this.opts[i] = options[i];
		}})();
	};
	this.toHTMLObject = function (){
		var obj_outer = document.createElement("div");
		obj_outer.className = "maze_outer";
		var obj_inner = document.createElement("div");
		obj_inner.className = "maze_inner";
		obj_outer.appendChild(obj_inner);
		
		if (!this.inited) this.init();

		for (var y=0; y<this.size[1]; y++){
			for (var x=0; x<this.size[0]; x++){
				var nd = document.createElement("div");
				nd.className = "maze_cell";
				nd.style.width = this.opts.divW + 'px';
				nd.style.height = this.opts.divW + 'px';
				nd.x = x; nd.y = y;
				nd.style.left = x * (this.opts.divW+1) + "px";
				nd.style.top = y * (this.opts.divW+1) + "px";
				for (var i in this.nodes[y][x].dir){
					if (this.nodes[y][x].dir[i]) nd.style["border" + i.charAt(0).toUpperCase() + i.substring(1)] = "1px solid transparent";
				}
				obj_inner.appendChild(nd);
				this.way[y][x] = obj_inner.appendChild(nd);
			}
		}
		return obj_outer;
	}
	this.wayarr = function(){
		return this.way;
	}
	
}
Maze.DIR = ["top", "left", "bottom", "right"];
function Node(maze, x, y){
	this.maze = maze;
	this.x = x || 0;
	this.y = y || 0;
	this.dir = {};
	this.inited = false;
	this.left = function(){ return this.maze.get_node(x-1, y); }
	this.right = function(){ return this.maze.get_node(x+1, y); }
	this.top = function(){ return this.maze.get_node(x, y-1); }
	this.bottom = function(){ return this.maze.get_node(x, y+1); }
	this.open = function(d){
		if (d == "top"){
			this.dir.top = this.top().dir.bottom = true;
		}else if (d == "right"){
			this.dir.right = this.right().dir.left = true;
		}else if (d == "bottom"){
			this.dir.bottom = this.bottom().dir.top = true;
		}else if (d == "left"){
			this.dir.left = this.left().dir.right = true;
		}
	}
	this.branches_count = function(){
		var re = 0;
		for (var i in this.dir) if (this.dir[i]) re++;
		return re;
	}
}
var CarMaze = function(options){
	this.opts = {
		wrapid : '',
		flagnumid : '',
		mainid : '',
		divW : 0,
		rowCount : 0,
		colCount : 0,
		flagsrc :'',
		plbg0 : '',
		plbg1 : '',
		plbg2 : '',
		plbg3 : '',
		overfn : null,
		succfn : null
	};
	this.wayElems = []; //单元格对象
	if(typeof options == "object"){
		this.setOptions(options);
	};
	this.gamebox = document.getElementById(this.opts.wrapid);
	this.flag = document.getElementById(this.opts.flagnumid);
	/**  
	* body: 车身，  
	* 数据结构{x:x0, y:y0, color:color0},  
	* x,y表示坐标,color表示颜色  
	**/  
	this.player = [];
	//当前移动的方向,取值0,1,2,3, 分别表示向上,右,下,左, 按键盘方向键可以改变它  
	this.direction = 1; 
	this.count = [this.opts.colCount,this.opts.rowCount]
	//行数  
	this.rowCount = this.opts.rowCount;  
	//列数  
	this.colCount = this.opts.colCount; 
	//敌方车和玩家车的当前位置
	this.curx = 0;    
	this.cury = 0;
	this.flagnum = 0;   //旗子数量  
	
};
CarMaze.prototype = {
	constructor : CarMaze,
	setOptions  : function(options){
		var _this = this;
		(function(){for(var i in options){
			_this.opts[i] = options[i];
		}})();
	},
	gamestart : function(){    //游戏开始
		this.init();
		this.move();
	},
	gameover : function(){    //游戏失败
		var _this = this;
		document.onkeydown= null;
		if(typeof this.opts.overfn == "function"){
			this.opts.overfn()
		}
	},
	gamesucc : function(){    //游戏成功
		var _this = this;
		if(typeof this.opts.succfn == "function"){
			this.opts.succfn && this.opts.succfn()
		}
	},
	init: function(){     //生成画布
		this.tbl = document.getElementById(this.opts.mainid);  
		var _this = this;
		var x = 0;  
		var y = 0;   
		//构造table 
		var mz = new Maze({
			divW : this.opts.divW,
			rowCount : this.opts.rowCount,
			colCount : this.opts.colCount
		});
		function init(){
			mz.create();
			_this.tbl.appendChild(mz.toHTMLObject());
		}
		init();
		//汽车初始位置  
		x = 0;  
		y = 0;
		this.wayElems = mz.wayarr();
		//产生旗子
		for(var i=0;i<this.rowCount;i++){
			for(var j=0;j<this.colCount;j++){
				if(i==0 && j==0){
					this.wayElems[y][x].style.background = 'url('+_this.opts.plbg1+') center center no-repeat';
					this.player.push({x:x,y:y,color:'url('+_this.opts.plbg1+') center center no-repeat'}); 
				}else if(i==this.colCount-1 && j==this.rowCount-1){
					this.wayElems[i][j].innerHTML = '终点';
					this.wayElems[i][j].style.lineHeight = this.opts.divW+'px';
					this.wayElems[i][j].style.textAlign = 'center';
					this.wayElems[i][j].setAttribute('flag',false);
				}else{
					this.wayElems[i][j].setAttribute('flag',false);
					this.wayElems[i][j].style.background = 'url('+_this.opts.flagsrc+') center center no-repeat';
				}
			}  
		}
	}, 
	  
	move: function(){   //  玩家车移动
		var _this = this;
		this.keydown();  
	}, 
	//移动一节身体  
	keydown : function(){
		var _this = this;
		//添加键盘事件
		document.onkeydown= function(e){  
			if (!e)e=window.event;  
			switch(e.keyCode | e.which | e.charCode){   
				case 37:{//left  
					if(beGin){
						_this.direction = 3;
						if(_this.wayElems[_this.player[0].y][_this.player[0].x].style.borderLeftColor != 'transparent'){
							return;
						}
						_this.erase(); 
						_this.moveOneStep();  
						_this.paint();
						break;  
					}
				}  
				case 38:{//up  
					if(beGin){
						 _this.direction = 0;
						 if(_this.wayElems[_this.player[0].y][_this.player[0].x].style.borderTopColor != 'transparent'){
							return;
						}
						_this.erase(); 
						_this.moveOneStep();  
						_this.paint();
						break;  
					}
					
				}  
				case 39:{//right  
					if(beGin){
						_this.direction = 1;
						if(_this.wayElems[_this.player[0].y][_this.player[0].x].style.borderRightColor != 'transparent'){
							return;
						}
						_this.erase(); 
						_this.moveOneStep();  
						_this.paint();
						break;
					}  
				}  
				case 40:{//down  
					if(beGin){
						_this.direction = 2;
						if(_this.wayElems[_this.player[0].y][_this.player[0].x].style.borderBottomColor != 'transparent'){
							return;
						}
						_this.erase(); 
						_this.moveOneStep();  
						_this.paint();
						break;  
					}
				}  
			}  
		}
	},
	moveOneStep: function(){           //玩家车移动
		var _this = this;
		if(_this.checkNextStep()==-1){  
			return;
		} 
		if(this.direction == 3){
			_this.player[0].color = 'url('+_this.opts.plbg3+') center center no-repeat';
		}else if(this.direction == 0){
			_this.player[0].color = 'url('+_this.opts.plbg0+') center center no-repeat';
		}else if(this.direction == 1){
			_this.player[0].color = 'url('+_this.opts.plbg1+') center center no-repeat';
		}else if(this.direction == 2){
			_this.player[0].color = 'url('+_this.opts.plbg2+') center center no-repeat';
		}
		var point = this.getNextPos();  
		//保留第一节的颜色
		var color = _this.player[0].color;
		//颜色向前移动  
		for(var i=0; i<_this.player.length-1; i++){  
			 _this.player[i].color = _this.player[i+1].color;  
		} 
		//车尾减一节， 车尾加一节，呈现车前进的效果  
		_this.player.pop(); 
		_this.player.unshift({x:point.x,y:point.y,color:color});
		
		this.curx = _this.player[0].x;  
		this.cury = _this.player[0].y;   
		if(this.wayElems[this.cury][this.curx].getAttribute('flag') == 'false'){
			//this.flagnum++;
			this.flag.innerHTML++;
			this.wayElems[this.cury][this.curx].setAttribute('flag',true);
		}
		if(this.curx == this.colCount-1 && this.cury == this.rowCount-1){
			this.gamesucc();
		}   
		//var nowhtml = this.flag.innerHTML;
		//this.flag.innerHTML = parseInt(nowhtml) + this.flagnum;
						
	},
	//绘制车身  
	paint: function(){ 
		var body;
		body=this.player;
		this.wayElems[body[0].y][body[0].x].style.background = body[0].color;  
	},  
	//擦除车身  
	erase: function(){         //车向右走
		var body;
		 body=this.player;
		 this.wayElems[body[0].y][body[0].x].style.background = ""; 
	},
	getNextPos: function(){
		var body;
		body=this.player;
		var x = body[0].x;  
		var y = body[0].y;  
		var color = body[0].color;
		//向上  
		if(this.direction==0){  
			y--;  
		}  
		//向右  
		else if(this.direction==1){  
			x++;  
		}  
		//向下  
		else if(this.direction==2){  
			y++;  
		}  
		//向左  
		else{  
			x--;  
		} 
		//返回一个坐标  
		return {x:x,y:y};  
	},  
	//检查将要移动到的下一步是什么  
	checkNextStep: function(){ 
		var body;
		body=this.player;
		var point = this.getNextPos();  
		var x = point.x;  
		var y = point.y; 
		var curx = body[0].x;  
		var cury = body[0].y;       
		if(x<0||x>=this.colCount||y<0||y>=this.rowCount){  
			return -1;//触边界  
		}   
	}       
};