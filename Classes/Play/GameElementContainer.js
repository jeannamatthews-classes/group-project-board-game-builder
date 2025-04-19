class GameElementContainer {
    constructor({
        containerWidth,
        containerHeight,
        containerTop,
        containerLeft,
        borderColor,
        borderWidth,
        backgroundColor
    }) {
        // main wrapper
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.width = `${containerWidth}%`;
        this.container.style.height = `${containerHeight}%`;
        this.container.style.top = `${containerTop}%`;
        this.container.style.left = `${containerLeft}%`;
        this.container.style.border = `${borderWidth} solid ${borderColor}`;
        this.container.style.backgroundColor = backgroundColor;
        this.container.style.overflow = 'visible'; // let slider hang below
        this.container.style.boxSizing = 'border-box';

        // scrollable inner area
        this.inner = document.createElement('div');
        this.inner.style.width = '100%';
        this.inner.style.height = '100%';
        this.inner.style.overflow = 'scroll';
        this.inner.style.position = 'relative';
        this.inner.style.boxSizing = 'border-box';
        this.inner.classList.add('scroll-force-visible');

        // this gets scaled with zoom
        this.zoomedContent = document.createElement('div');
        this.zoomedContent.style.width = '100%';
        this.zoomedContent.style.height = '100%';
        this.zoomedContent.style.position = 'relative';
        this.zoomedContent.style.transformOrigin = 'top left';

        this.inner.appendChild(this.zoomedContent);

        // zoom wrapper (used to clip inner properly)
        this.zoomWrapper = document.createElement('div');
        this.zoomWrapper.style.width = '100%';
        this.zoomWrapper.style.height = '100%';
        this.zoomWrapper.style.overflow = 'hidden';
        this.zoomWrapper.style.position = 'relative';
        this.zoomWrapper.appendChild(this.inner);

        this.container.appendChild(this.zoomWrapper);

        // slider control
        this.zoomLevel = 1;
        this.slider = document.createElement('input');
        this.slider.type = 'range';
        this.slider.min = 0.25;
        this.slider.max = 2;
        this.slider.step = 0.05;
        this.slider.value = this.zoomLevel;
        this.slider.style.position = 'absolute';
        this.slider.style.top = '100%';
        this.slider.style.left = '0';
        this.slider.style.transform = 'translateY(5px)';
        this.slider.style.width = '100%';
        this.slider.style.zIndex = 10;
        this.slider.style.background = '#ccc';

        this.slider.addEventListener('input', () => {
            this.setZoom(this.slider.value);
        });

        this.container.appendChild(this.slider);
        document.body.appendChild(this.container);
    }

    setZoom(value) {
        this.zoomLevel = parseFloat(value);
        this.zoomedContent.style.transform = `scale(${this.zoomLevel})`;
    }

    addContent(el) {
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.width = '100%';
        el.style.height = '100%';
        this.zoomedContent.appendChild(el);
    }

    getElement() {
        return this.container;
    }
}
