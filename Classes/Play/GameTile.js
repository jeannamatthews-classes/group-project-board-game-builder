class GameTile {
    constructor(logicalTile) {
        this.logical = logicalTile;

        const el = document.createElement('div');
        el.classList.add('game-tile');
        el.style.position = 'relative';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.boxSizing = 'border-box';
        el.style.border = '1px solid rgba(0,0,0,0.2)';
        el.style.backgroundColor = logicalTile.sprite.fillColor || '#ccc';
        el.style.cursor = 'pointer';
        el.style.overflow = 'hidden';

        // SVG overlay (image from SPRITE_LIBRARY)
        if (logicalTile.sprite.imageName && SPRITE_LIBRARY[logicalTile.sprite.imageName]) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            wrapper.style.pointerEvents = 'none';
            wrapper.style.zIndex = 1;

            const temp = document.createElement('div');
            temp.innerHTML = SPRITE_LIBRARY[logicalTile.sprite.imageName];
            const svg = temp.querySelector('svg');

            if (svg) {
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.display = 'block';

                svg.querySelectorAll('[fill]').forEach(el => {
                    el.setAttribute('fill', this.logical.sprite.imageColor || '#000');
                });

                wrapper.appendChild(svg);
                el.appendChild(wrapper);
            }
        }

        // Text overlay
        if (logicalTile.sprite.text) {
            const text = document.createElement('div');
            text.innerText = logicalTile.sprite.text;
            text.style.position = 'absolute';
            text.style.top = '50%';
            text.style.left = '50%';
            text.style.transform = 'translate(-50%, -50%)';
            text.style.color = logicalTile.sprite.textColor || '#000';
            text.style.fontSize = '10px';
            text.style.fontWeight = 'bold';
            text.style.zIndex = 2;
            text.style.pointerEvents = 'none';
            el.appendChild(text);
        }

        // If tile is disabled
        if (this.logical.enabled === false) {
            el.style.opacity = '0.4';
        }

        console.log(this.logical)
        // Click handling
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('click tile: x-', this.logical.xCoordinate, ' y-', this.logical.yCoordinate);
            this.logical.clickObject(true);
        });

        this.container = el;
    }
}
