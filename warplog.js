(function(Scratch) {
  'use strict';

  class WarpLOG {
    getInfo() {
      return {
        id: 'warplog', 
        name: 'warpLOG',
        color1: '#4c97ff',
        blocks: [
          // 1. デザイン設定
          {
            opcode: 'setConfig',
            blockType: Scratch.BlockType.COMMAND,
            text: 'デザイン設定: 幅[W]% 高[H]% | 背景[BG] 文字[TXT] ボタン[BTN]',
            arguments: {
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 45 },
              BG: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' },
              TXT: { type: Scratch.ArgumentType.COLOR, defaultValue: '#333333' },
              BTN: { type: Scratch.ArgumentType.COLOR, defaultValue: '#4c97ff' }
            }
          },
          // 2. アラート（画像対応）
          {
            opcode: 'showAlertImg',
            blockType: Scratch.BlockType.COMMAND,
            text: '表示: タイトル[TITLE] 本文[BODY] 画像URL[IMG_URL]',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'お知らせ' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'こんにちは！' },
              IMG_URL: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
            }
          },
          // 3. 2択確認
          {
            opcode: 'showConfirm',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '2択確認: [TITLE] 内容:[BODY] ボタン:[BTN1] / [BTN2]',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '確認' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '実行しますか？' },
              BTN1: { type: Scratch.ArgumentType.STRING, defaultValue: 'はい' },
              BTN2: { type: Scratch.ArgumentType.STRING, defaultValue: 'いいえ' }
            }
          },
          // 4. 3択選択
          {
            opcode: 'showChoice3',
            blockType: Scratch.BlockType.REPORTER,
            text: '3択選択: [TITLE] 内容:[BODY] ボタン:[B1] [B2] [B3]',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '選択してください' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'どれにしますか？' },
              B1: { type: Scratch.ArgumentType.STRING, defaultValue: 'A' },
              B2: { type: Scratch.ArgumentType.STRING, defaultValue: 'B' },
              B3: { type: Scratch.ArgumentType.STRING, defaultValue: 'C' }
            }
          },
          // 5. テキスト入力
          {
            opcode: 'showPrompt',
            blockType: Scratch.BlockType.REPORTER,
            text: '入力: [TITLE] 本文[BODY] 初期値[DEF]',
            arguments: {
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: '入力' },
              BODY: { type: Scratch.ArgumentType.STRING, defaultValue: '内容を入力してください' },
              DEF: { type: Scratch.ArgumentType.STRING, defaultValue: 'ここに入力' }
            }
          }
        ]
      };
    }

    constructor() {
      this.config = {
        width: 50, height: 45,
        bgColor: '#ffffff', txtColor: '#333333', btnColor: '#4c97ff'
      };
    }

    setConfig(args) {
      this.config.width = args.W;
      this.config.height = args.H;
      this.config.bgColor = args.BG;
      this.config.txtColor = args.TXT;
      this.config.btnColor = args.BTN;
    }

    _createModal(type, title, body, options = {}) {
      return new Promise(resolve => {
        const c = this.config;
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
          position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)', zIndex: '1000000', display: 'flex',
          justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
          backgroundColor: c.bgColor, color: c.txtColor, padding: '30px', borderRadius: '20px',
          width: `${c.width}vw`, maxHeight: `${c.height}vh`, border: `5px solid ${c.btnColor}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto',
          boxSizing: 'border-box', animation: 'warpPop 0.3s ease-out'
        });

        const h2 = document.createElement('h2');
        h2.innerText = title;
        h2.style.margin = '0 0 15px 0';
        box.appendChild(h2);

        // 画像の追加
        if (options.imgUrl) {
          const img = document.createElement('img');
          img.src = options.imgUrl;
          Object.assign(img.style, { maxWidth: '100%', maxHeight: '150px', marginBottom: '15px', borderRadius: '8px' });
          box.appendChild(img);
        }

        const p = document.createElement('p');
        p.innerText = body;
        p.style.marginBottom = '20px';
        box.appendChild(p);

        let inputField = null;
        if (type === 'prompt') {
          inputField = document.createElement('input');
          inputField.value = options.defaultText || '';
          Object.assign(inputField.style, { width: '90%', padding: '10px', marginBottom: '20px', fontSize: '18px' });
          box.appendChild(inputField);
        }

        const btnContainer = document.createElement('div');
        Object.assign(btnContainer.style, { display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' });

        const addBtn = (txt, val) => {
          const btn = document.createElement('button');
          btn.innerText = txt;
          Object.assign(btn.style, {
            padding: '12px 24px', fontSize: '16px', backgroundColor: c.btnColor, color: '#fff',
            border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', minWidth: '80px'
          });
          btn.onclick = () => {
            document.body.removeChild(overlay);
            resolve(type === 'prompt' ? inputField.value : val);
          };
          btnContainer.appendChild(btn);
        };

        if (type === 'confirm') {
          addBtn(options.btn1 || 'OK', true);
          addBtn(options.btn2 || 'Cancel', false);
        } else if (type === 'choice3') {
          addBtn(options.b1, options.b1);
          addBtn(options.b2, options.b2);
          addBtn(options.b3, options.b3);
        } else {
          addBtn(options.btn1 || 'OK', null);
        }

        box.appendChild(btnContainer);
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        if (!document.getElementById('warpStyle')) {
          const s = document.createElement('style');
          s.id = 'warpStyle';
          s.innerHTML = `@keyframes warpPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`;
          document.head.appendChild(s);
        }
      });
    }

    showAlertImg(args) { return this._createModal('alert', args.TITLE, args.BODY, { imgUrl: args.IMG_URL }); }
    showConfirm(args) { return this._createModal('confirm', args.TITLE, args.BODY, { btn1: args.BTN1, btn2: args.BTN2 }); }
    showChoice3(args) { return this._createModal('choice3', args.TITLE, args.BODY, { b1: args.B1, b2: args.B2, b3: args.B3 }); }
    showPrompt(args) { return this._createModal('prompt', args.TITLE, args.BODY, { defaultText: args.DEF }); }
  }

  Scratch.extensions.register(new WarpLOG());
})(Scratch);
