(function(Scratch) {
  'use strict';

  class UltimateUIFixed {
    getInfo() {
      return {
        id: 'uiadvanced', // IDをすべて小文字に変更（これでエラーが消えるはずです）
        name: '究極のUI',
        color1: '#4c97ff',
        blocks: [
          // 1. デザイン設定
          {
            opcode: 'setConfig',
            blockType: Scratch.BlockType.COMMAND,
            text: 'デザイン設定: 全体[W]% x [H]% | 全体色: 背景[BG] 文字[TXT] ボタン[BTN] | 入力欄: 背景[IN_BG] 文字[IN_TXT]',
            arguments: {
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 40 },
              BG: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' },
              TXT: { type: Scratch.ArgumentType.COLOR, defaultValue: '#333333' },
              BTN: { type: Scratch.ArgumentType.COLOR, defaultValue: '#4c97ff' },
              IN_BG: { type: Scratch.ArgumentType.COLOR, defaultValue: '#f0f0f0' },
              IN_TXT: { type: Scratch.ArgumentType.COLOR, defaultValue: '#000000' }
            }
          },
          // 2. アラート
          {
            opcode: 'showAlert',
            blockType: Scratch.BlockType.COMMAND,
            text: '表示: タイトル [TITLE] 本文 [BODY] (ボタン: [BTN_TEXT])',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'お知らせ' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'こんにちは！' },
              BTN_TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'OK' }
            }
          },
          // 3. 確認
          {
            opcode: 'showConfirm',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '確認: タイトル [TITLE] 本文 [BODY] (ボタン: [BTN1] [BTN2])',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '確認' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '実行しますか？' },
              BTN1: { type: Scratch.ArgumentType.STRING, defaultValue: 'はい' },
              BTN2: { type: Scratch.ArgumentType.STRING, defaultValue: 'いいえ' }
            }
          },
          // 4. 入力
          {
            opcode: 'showPrompt',
            blockType: Scratch.BlockType.REPORTER,
            text: '入力: タイトル [TITLE] 本文 [BODY] デフォルト文字 [DEF_TEXT] (ボタン: [BTN_TEXT])',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '名前入力' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'あなたの名前を教えてください。' },
              DEF_TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'プレイヤー1' },
              BTN_TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '決定' }
            }
          }
        ]
      };
    }

    constructor() {
      this.config = {
        width: 50,
        height: 40,
        bgColor: '#ffffff',
        txtColor: '#333333',
        btnColor: '#4c97ff',
        inputBgColor: '#f0f0f0',
        inputTxtColor: '#000000'
      };
    }

    setConfig(args) {
      this.config.width = args.W;
      this.config.height = args.H;
      this.config.bgColor = args.BG;
      this.config.txtColor = args.TXT;
      this.config.btnColor = args.BTN;
      this.config.inputBgColor = args.IN_BG;
      this.config.inputTxtColor = args.IN_TXT;
    }

    _createModal(type, title, body, btn1Text, btn2Text, defaultInput) {
      return new Promise(resolve => {
        const c = this.config;
        const widthPercent = Math.max(10, Math.min(100, Number(c.width)));
        const heightPercent = Math.max(10, Math.min(100, Number(c.height)));

        // オーバーレイ
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
          position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: '999999', display: 'flex',
          justifyContent: 'center', alignItems: 'center', fontFamily: 'Helvetica, Arial, sans-serif'
        });

        // ボックス
        const box = document.createElement('div');
        Object.assign(box.style, {
          backgroundColor: c.bgColor, color: c.txtColor, padding: '25px', borderRadius: '15px',
          boxShadow: '0 15px 50px rgba(0,0,0,0.5)', textAlign: 'center',
          width: `${widthPercent}vw`, maxHeight: `${heightPercent}vh`, minHeight: '200px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          boxSizing: 'border-box', overflowY: 'auto', border: `4px solid ${c.btnColor}`,
          animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });

        // タイトル
        const h2 = document.createElement('h2');
        h2.innerText = title;
        Object.assign(h2.style, { margin: '0 0 15px 0', fontSize: '28px', color: c.txtColor, width: '100%' });
        box.appendChild(h2);

        // 本文
        const p = document.createElement('p');
        p.innerText = body;
        Object.assign(p.style, { fontSize: '18px', marginBottom: '20px', lineHeight: '1.5', width: '100%' });
        box.appendChild(p);

        // 入力欄
        let inputField = null;
        if (type === 'prompt') {
          inputField = document.createElement('input');
          inputField.type = 'text';
          inputField.value = defaultInput;
          Object.assign(inputField.style, {
            width: '80%', padding: '10px', fontSize: '20px', marginBottom: '20px',
            borderRadius: '8px', 
            border: `2px solid #ccc`, 
            outline: 'none', 
            backgroundColor: c.inputBgColor, 
            color: c.inputTxtColor
          });
          
          inputField.onfocus = () => inputField.style.border = `2px solid ${c.btnColor}`;
          inputField.onblur = () => inputField.style.border = `2px solid #ccc`;
          
          inputField.onkeydown = (e) => {
            if(e.key === 'Enter') {
               document.body.removeChild(overlay);
               resolve(inputField.value);
            }
          };
          box.appendChild(inputField);
        }

        // ボタン
        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '15px';
        btnContainer.style.width = '100%';
        btnContainer.style.justifyContent = 'center';

        const createBtn = (text, val, isSecondary) => {
          const btn = document.createElement('button');
          btn.innerText = text;
          const bg = isSecondary ? '#999' : c.btnColor;
          Object.assign(btn.style, {
            padding: '10px 30px', fontSize: '18px', backgroundColor: bg, color: '#fff',
            border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', flex: '1', maxWidth: '150px'
          });
          btn.onmouseover = () => btn.style.opacity = '0.9';
          btn.onmouseout = () => btn.style.opacity = '1';
          btn.onclick = () => {
            document.body.removeChild(overlay);
            if (type === 'prompt') resolve(inputField.value);
            else resolve(val);
          };
          return btn;
        };

        if (type === 'confirm') {
          btnContainer.appendChild(createBtn(btn1Text, true, false));
          btnContainer.appendChild(createBtn(btn2Text, false, true));
        } else {
          btnContainer.appendChild(createBtn(btn1Text, null, false));
        }
        
        box.appendChild(btnContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        if(inputField) setTimeout(() => inputField.focus(), 50);

        if (!document.getElementById('popInStyle')) {
            const style = document.createElement('style');
            style.id = 'popInStyle';
            style.innerHTML = `@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`;
            document.head.appendChild(style);
        }
      });
    }

    showAlert(args) { return this._createModal('alert', args.TITLE, args.BODY, args.BTN_TEXT); }
    showConfirm(args) { return this._createModal('confirm', args.TITLE, args.BODY, args.BTN1, args.BTN2); }
    showPrompt(args) { return this._createModal('prompt', args.TITLE, args.BODY, args.BTN_TEXT, null, args.DEF_TEXT); }
  }

  Scratch.extensions.register(new UltimateUIFixed());
})(Scratch);
