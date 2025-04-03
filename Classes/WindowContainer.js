class WindowContainer {
    constructor(title = "Window", closeable = true, options = {}) {
        const {
            width,
            height,
            offsetTop,
            offsetLeft
        } = options;

        this.container = document.createElement('div');
        this.container.classList.add('window-container');

        // Optional size
        if (width) this.container.style.width = typeof width === 'number' ? `${width}px` : width;
        if (height) this.container.style.height = typeof height === 'number' ? `${height}px` : height;

        // Optional position
        if (offsetTop !== undefined) this.container.style.top = typeof offsetTop === 'number' ? `${offsetTop}px` : offsetTop;
        if (offsetLeft !== undefined) this.container.style.left = typeof offsetLeft === 'number' ? `${offsetLeft}px` : offsetLeft;

        this.header = document.createElement('div');
        this.header.classList.add('window-header');
        this.header.innerHTML = `<span>${title}</span>`;

        if (closeable) {
            const closeBtn = document.createElement('button');
            closeBtn.classList.add('window-close');
            closeBtn.innerHTML = '✕';
            closeBtn.onclick = () => this.container.remove();
            this.header.appendChild(closeBtn);
        }

        this.content = document.createElement('div');
        this.content.classList.add('window-content');

        this.container.appendChild(this.header);
        this.container.appendChild(this.content);

        // Required positioning
        this.container.style.position = 'absolute';
        document.body.appendChild(this.container);

        this.makeDraggable();
    }

    makeDraggable() {
        let isDragging = false;
        let offsetX, offsetY;

        this.header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - this.container.offsetLeft;
            offsetY = e.clientY - this.container.offsetTop;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            this.container.style.left = (e.clientX - offsetX) + 'px';
            this.container.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    setContent(html) {
        this.content.innerHTML = html;
    }

    appendContent(el) {
        this.content.appendChild(el);
    }
}
