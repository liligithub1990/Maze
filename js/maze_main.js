var time;
var timer;
var n = 30;
var ofailwindow=document.getElementById('gamePopLoser');
var osuccwindow=document.getElementById('gamePopWinner');
var gamebox=document.getElementById('game_box');
var oStart=document.getElementById('gameStart');
var gameLoad = document.getElementById('gameLoad');		/* 倒计时 */
var gameMask = document.getElementById('gameMask');		/* 遮罩层 */
var main= document.getElementById('main');
var lifebox = document.getElementById('lifebox');
var lives = lifebox.children;
var gametime = document.getElementById('gameTime');
var color='#eee';
var isStart = true;
var beGin = false;
var failcont = 0;

//var oBgimg=document.getElementById('bg_img');
addHandler(oStart,'click',function(){
	if(isStart){
		oStart.style.display='none';
		time=n;
		gameLoad.style.display = 'block';
		gameLoad.className = 'game_num_desc game_num_3';
		setTimeout(function(){
			gameLoad.className = 'game_num_desc game_num_2';
			setTimeout(function(){
				gameLoad.className = 'game_num_desc game_num_1';
				setTimeout(function(){
					gameLoad.className = 'game_num_desc game_num_go';
					setTimeout(function(){
						gameLoad.style.display = 'none';
						gameMask.style.display = 'none';
						gameLoad.className = 'game_num_desc game_num_3';
						gameMask.style.display='none';
						beGin = true;
						//document.getElementById('main').innerHTML = '';
						//oBgimg.style.display='none';
						clearInterval(timer);
						
						timer = setInterval(function(){
							time--;
							if(gametime){
								gametime.innerHTML = time;
							}
							if(time<=0){
								failcont ++ ;
								switch(failcont){
									case 1:	
										for(var i=3;i<lives.length;i++){
											lives[i].className = 'nolife';
										}
									break;
									case 2:	
										for(var i=2;i<lives.length;i++){
											lives[i].className = 'nolife';
										}
									break;
									case 3:	
										for(var i=1;i<lives.length;i++){
											lives[i].className = 'nolife';
										}
									break;
									case 4:	
										for(var i=0;i<lives.length;i++){
											lives[i].className = 'nolife';
										}
										isStart = false;
									break;
								}
								carmaze.gameover();
								
								clearInterval(timer);
							}
						},1000);
						
						
					},1000);
				},1000);
			},1000);
		},1000);
	}else{
		alert('您今天已经玩儿够次数啦。。明天再来玩儿吧（ps：这个版本其实刷新也可以）')
	}
})
var aReplaybtn=getByClass(document,'game_btn');   /*重玩按钮*/
for(var i=0;i<aReplaybtn.length;i++){
	addHandler(aReplaybtn[i],'click',function(){
		oStart.style.display='block';
		gameover();
		//gamebox.innerHTML=gamestr;
	})
}
var aClose=getByClass(document,'game_pop_close');     /*关闭按钮*/
for(var i=0;i<aClose.length;i++){
	addHandler(aClose[i],'click',function(){
		if(ofailwindow.style.display=='block'){
			ofailwindow.style.display='none';
		}else if(osuccwindow.style.display=='block'){
			osuccwindow.style.display='none';
		}
		gameover();
		oStart.style.display='block';
	})
}
function gameover(){           /*游戏结束*/
	
	ofailwindow.style.display='none';
	osuccwindow.style.display='none';
	
	while(main.hasChildNodes()){
		main.removeChild(main.firstChild);
	}
	flagnum.innerHTML = 0;
	gametime.innerHTML = n;
	i=0;
	document.getElementById('main').innerHTML = '';
	clearInterval(timer);
	initGame();	
}
var carflag;
var flagnum = document.getElementById('flagnum');
	var objarr = [
		{
			divW : 87,
			colCount : 5,
			rowCount : 5,
			plbg0 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/car00.png',
			plbg1 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/car01.png',
			plbg2 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/car02.png',
			plbg3 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/car03.png'
		},
		{
			divW : 48,
			colCount : 9,
			rowCount : 9,
			plbg0 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player0.png',
			plbg1 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player1.png',
			plbg2 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player2.png',
			plbg3 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player3.png'
		},
		{
			divW : 39,
			
			colCount : 11,
			rowCount : 11,
			plbg0 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player0.png',
			plbg1 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player1.png',
			plbg2 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player2.png',
			plbg3 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player3.png'
		},
		{
			divW : 30,
			colCount : 14,
			rowCount : 14,
			plbg0 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player0.png',
			plbg1 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player1.png',
			plbg2 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player2.png',
			plbg3 : 'http://js.xcar.com.cn/liyan_game/maze_up/images/player3.png'
		}
	];
	var carmaze,i=0;
	function initGame(){
		if( i >= objarr.length ){
			if(osuccwindow){
				osuccwindow.style.display='block';
				osuccwindow.style.zIndex=100;
			}
			gameMask.style.display = 'block';
			//oBgimg.style.display='block';
			failcont = 0;
			beGin = false;
			clearInterval(timer);
			return;
		};
		document.getElementById('main').innerHTML = '';
		carmaze = new CarMaze({
			wrapid : 'game_box',
			flagnumid : 'flagnum',
			mainid : 'main',
			divW : objarr[i].divW,
			colCount : objarr[i].colCount,
			rowCount : objarr[i].rowCount,
			flagsrc :'http://js.xcar.com.cn/liyan_game/maze_up/images/mark.png',
			plbg0 : objarr[i].plbg0,
			plbg1 : objarr[i].plbg1,
			plbg2 : objarr[i].plbg2,
			plbg3 : objarr[i].plbg3,
			overfn : function(){
				if(ofailwindow){
					ofailwindow.style.display='block';
					ofailwindow.style.zIndex=100;
				}
				gameMask.style.display = 'block';	
			},
			succfn : function(){
				initGame();
			}
		});
		carmaze.gamestart();
		i++;
	}
initGame();	
