var app = new Vue({
    el: '#vue-app',
    data: {
        paint: false,
        clickX: [],
        clickY: [],
        clickDrag: [],
        data: 'Draw inside the box',
        progress: false,
        progress_text: '',
        math_answer: null,
        data_array: []
    },
    methods: {
        startDraw(e) {
            var mainCanvas = document.getElementById('mainCanvas')
            var mouseX = e.pageX - mainCanvas.offsetLeft;
            var mouseY = e.pageY - mainCanvas.offsetTop;
            this.addClick(e.pageX - mainCanvas.offsetLeft, e.pageY - mainCanvas.offsetTop);
            this.paint = true
            this.redraw();
        },
        endDraw(e) {
            var _this = this
            _this.paint = false
            _this.data = 'Please wait...'
            Tesseract.recognize(document.getElementById('mainCanvas').getContext("2d"))
                .progress(function (message) {
                    _this.progress = true
                    _this.progress_text = message.status
                })
                .then(function (result) {
                    //console.log('r', result)
                    _this.data = result.text
                    _this.data_array = []
                    result.symbols.forEach(function (str) {
                        _this.data_array.push(str.text)
                    })

                    if (_this.data_array.includes("+")) {
                        var index = _this.data_array.indexOf("+") + 1
                        var converted_array = _this.data_array.join('')
                        if(converted_array.slice(-1) !== '+') {
                            console.log('aahhh')
                            _this.math_answer = math.eval(converted_array)
                        } else {
                            console.log('wtf')
                        }
                        
                    }
                }).catch(function (error) {
                    console.log('e', error)
                    _this.progress = true
                    _this.progress_text = error
                })
        },
        leave() {
            if (this.paint) {
                this.endDraw()
            }
        },
        drawing(e) {
            if (this.paint) {
                this.addClick(e.pageX - mainCanvas.offsetLeft, e.pageY - mainCanvas.offsetTop, true);
                this.redraw();
            }
        },
        addClick(x, y, dragging) {
            this.clickX.push(x);
            this.clickY.push(y);
            this.clickDrag.push(dragging)
        },
        redraw() {
            var mainCanvas = document.getElementById('mainCanvas').getContext("2d");
            mainCanvas.clearRect(0, 0, mainCanvas.canvas.width, mainCanvas.canvas.height); // Clears the canvas

            mainCanvas.strokeStyle = "#FFFFFF";
            mainCanvas.lineJoin = "round";
            mainCanvas.lineWidth = 5;

            for (var i = 0; i < this.clickX.length; i++) {
                mainCanvas.beginPath();
                if (this.clickDrag[i] && i) {
                    mainCanvas.moveTo(this.clickX[i - 1], this.clickY[i - 1]);
                } else {
                    mainCanvas.moveTo(this.clickX[i] - 1, this.clickY[i]);
                }
                mainCanvas.lineTo(this.clickX[i], this.clickY[i]);
                mainCanvas.closePath();
                mainCanvas.stroke();
            }
        },
        clearCanvas() {
            console.log('cleared')
            var mainCanvas = document.getElementById('mainCanvas').getContext("2d");
            mainCanvas.clearRect(0, 0, mainCanvas.canvas.width, mainCanvas.canvas.height);
            this.clickX = []
            this.clickY = []
            this.clickDrag = []
            this.data_array = []
            this.math_answer = null
            this.data = 'Draw inside the box'
        }
    }
})