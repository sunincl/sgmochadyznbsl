// SCRIPT BLOCK 1
var $ = {};
// SCRIPT BLOCK 2

		// 通用模态工具（返回 Promise）
		function _showModal(options){
			return new Promise(function(resolve){
				var modal = document.getElementById('gameModal');
				var text = document.getElementById('modalText');
				var sub = document.getElementById('modalSub');
				var inputWrap = document.getElementById('modalInputWrap');
				var btnWrap = document.getElementById('modalButtons');
				text.textContent = options.text || '';
				sub.textContent = options.sub || '';
				inputWrap.innerHTML = '';
				btnWrap.innerHTML = '';
				if(options.input){
					inputWrap.style.display = 'block';
					var inp = document.createElement('input');
					inp.type = options.mask ? 'password' : 'text';
					inp.maxLength = options.maxLength || 32;
					inp.style.padding = '10px 12px';
					inp.style.borderRadius = '8px';
					inp.style.border = '1px solid rgba(255,255,255,0.08)';
					inp.style.background = 'rgba(255,255,255,0.02)';
					inp.style.color = '#fff';
					inputWrap.appendChild(inp);
					setTimeout(function(){ inp.focus(); },50);
				} else {
					inputWrap.style.display = 'none';
				}
				if(options.buttons && options.buttons.length){
					options.buttons.forEach(function(b){
						var btn = document.createElement('button');
						btn.textContent = b.label;
						btn.style.padding = '8px 12px';
						btn.style.borderRadius = '8px';
						btn.style.border = 'none';
						btn.style.cursor = 'pointer';
						btn.style.background = b.primary? '#6ee7b7' : 'rgba(255,255,255,0.06)';
						btn.style.color = b.primary? '#042f1f' : '#fff';
						btn.addEventListener('click', function(){
							modal.style.display = 'none';
							if(options.input){ resolve({button:b.value, value: inputWrap.querySelector('input') ? inputWrap.querySelector('input').value : ''}); }
							else resolve(b.value);
						});
						btnWrap.appendChild(btn);
					});
				} else {
					var ok = document.createElement('button');
					ok.textContent = '确定';
					ok.style.padding = '8px 12px';
					ok.style.borderRadius = '8px';
					ok.style.border = 'none';
					ok.style.cursor = 'pointer';
					ok.style.background = '#6ee7b7';
					ok.style.color = '#042f1f';
					ok.addEventListener('click', function(){ modal.style.display='none'; resolve(true); });
					btnWrap.appendChild(ok);
				}
				modal.style.display = 'flex';
			});
		}

		window.showConfirm = function(text){
			return _showModal({text:text, buttons:[{label:'是',value:true,primary:true},{label:'否',value:false}]});
		};
		window.showPasswordPrompt = function(text){
			return _showModal({text:text, input:true, mask:true, maxLength:4, buttons:[{label:'提交',value:'ok',primary:true}] }).then(function(r){ return r.value; });
		};
		window.showModalMessage = function(text){
			return _showModal({text:text});
		};
		window.showToast = function(text){
			return _showModal({text:text});
		};

		// 序章流程
		function initIntro(){
			var chapters = document.getElementById('chapters');
			var skipBtn = document.getElementById('skipBtn');
			var bottomHint = document.getElementById('bottomHint');
			// 第一页显示右下提示
			bottomHint.style.display = 'block';
			bottomHint.textContent = '右下角提示：点击任意键继续';
			// 点击任意处或任意键继续到第二页
			document.addEventListener('keydown', function onAny(){ document.removeEventListener('keydown', onAny); proceedStep1(); });
			document.addEventListener('click', function onAnyClick(){ document.removeEventListener('click', onAnyClick); proceedStep1(); });
		}
		if(document.readyState !== 'loading'){
			initIntro();
		} else {
			document.addEventListener('DOMContentLoaded', initIntro);
		}

			function proceedStep1(){
				var box = document.getElementById('chapterBox');
				box.innerHTML = '<div style="font-size:clamp(2.2rem, 5vw, 5rem);font-weight:900;letter-spacing:0.25em;color:#c3ff9b;">怎么可能这么简单</div><div id="sub" style="opacity:0;margin-top:18px;color:#d8ffb4;font-size:1.2rem"></div><div id="hint" style="margin-top:24px;color:#e9ffd9;font-size:1rem;opacity:0;">准备迎接挑战吧</div>';
				bottomHint.style.display = 'block';
				bottomHint.textContent = '右下角提示：再按一次即可开始游戏';
				// 立即允许继续进入游戏
				document.addEventListener('keydown', function onAny2(){ document.removeEventListener('keydown', onAny2); finishIntro(); });
				document.addEventListener('click', function onAnyClick2(){ document.removeEventListener('click', onAnyClick2); finishIntro(); });
				// 500ms 后显示二级标题
				setTimeout(function(){
					var sub = document.getElementById('sub');
					var hint = document.getElementById('hint');
					if(!sub){
						box.innerHTML = '<div style="font-size:clamp(2.2rem, 5vw, 5rem);font-weight:900;letter-spacing:0.25em;color:#c3ff9b;">怎么可能这么简单</div><div id="sub" style="margin-top:18px;color:#d8ffb4;font-size:1.2rem">准备迎接挑战吧</div><div id="hint" style="margin-top:24px;color:#e9ffd9;font-size:1rem;">再按一次即可开始游戏</div>';
					} else {
						sub.textContent = '准备迎接挑战吧';
						sub.style.opacity = 1;
						if(hint){
							hint.style.opacity = 1;
							hint.textContent = '再按一次即可开始游戏';
						}
					}
				}, 500);
			}

			function finishIntro(){
				// 隐藏章节覆盖层和提示
				document.getElementById('chapters').style.display='none';
				document.getElementById('bottomHint').style.display='none';
				// 显示跳过游戏按钮
				document.getElementById('skipBtn').style.display='block';
				document.getElementById('skipBtn').textContent = '跳过游戏';
				// 尝试触发游戏初始化，并确保画布显示
				document.documentElement.classList.add('loaded');
				console.log('[intro] finishIntro called - attempting to start game');
				(function launchGame(attempts){
					attempts = attempts || 0;
					if(window.$ && typeof window.$.init === 'function'){
						console.log('[intro] calling $.init() after', attempts, 'attempts');
						try{ window.$.init(); }catch(e){ console.error('[intro] $.init threw', e); }
					}else{
						if(attempts < 200){
							setTimeout(function(){ launchGame(attempts+1); }, 100);
						} else {
							console.error('[intro] $.init not available after', attempts, 'attempts');
						}
					}
				})();
			}

			// 跳过按钮逻辑：在任何时间点击将弹出请求密码的提示
			skipBtn.addEventListener('click', function(){
				_showModal({
					text:'去请求云亦获取密码',
					input:true,
					mask:true,
					maxLength:4,
					buttons:[
						{label:'提交', value:'submit', primary:true},
						{label:'返回', value:'return'}
					]
				}).then(function(result){
					if(result.button === 'submit'){
						if(result.value === '0824'){
							window.showModalMessage('密码正确，正在跳过游戏').then(function(){ window.location.href='../../xing.html'; });
						} else {
							window.showModalMessage('密码错误');
						}
					}
						});
					});
		
// SCRIPT BLOCK 3

		(function(){
			var map = {
				'RADIUS RAID':'半径突袭',
				'MOVE\nAIM/FIRE\nAUTOFIRE\nPAUSE\nMUTE':'移动\n瞄准/射击\n自动射击\n暂停\n静音',
				'WASD/ARROWS\nMOUSE\nF\nP\nM':'WASD/方向键\n鼠标\nF\nP\nM',
				'HEALTH':'生命',
				'PROGRESS':'进度',
				'SCORE':'得分',
				'BEST':'最高',
				'PAUSED':'已暂停',
				'GAME OVER':'游戏结束',
				'STATS':'统计',
				'SCORE\nLEVEL\nKILLS\nBULLETS\nPOWERUPS\nTIME':'得分\n关卡\n击杀\n子弹\n增益\n时间'
			};
			function translate(s){ return map[s] || s; }
			function patch(){
				if(window.$ && typeof $.text === 'function'){
					var orig = $.text;
					$.text = function(opts){
						if(opts && opts.text) opts.text = translate(opts.text);
						return orig(opts);
					};
					return true;
				}
				return false;
			}
			var t = setInterval(function(){ if(patch()) clearInterval(t); },50);
		})();
		
