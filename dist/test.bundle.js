webpackJsonp([0,1],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __webpack_require__(1);
class D3SeatingChart {
    constructor(element) {
        this.element = element;
        this.margin = 20;
    }
    init() {
        let svgSelection = d3.select(this.element);
        let gSelection = svgSelection.select('g');
        this.bindEvents();
        this.zoom(gSelection, false);
    }
    stripStyles(selector) {
        let svgSelection = d3.select(this.element);
        svgSelection.selectAll(selector)
            .attr('stroke', null)
            .attr('stroke-width', null)
            .attr('fill', null);
    }
    getBoard() {
        let svgSelection = d3.select(this.element);
        return svgSelection.select('[type="Board"]');
    }
    getSeatingAreas() {
        let svgSelection = d3.select(this.element);
        return svgSelection.selectAll('[type="SeatingArea"]');
    }
    getSeatingAreaExposes() {
        let svgSelection = d3.select(this.element);
        return svgSelection.selectAll('[type="SeatingAreaExpose"]');
    }
    getSeats() {
        let svgSelection = d3.select(this.element);
        return svgSelection.selectAll('[type="SeatingAreaExpose"] rect');
    }
    goToBoard() {
        let svgSelection = d3.select(this.element);
        let boardSelection = svgSelection.select('[type="Board"]');
        this.zoom(boardSelection);
    }
    zoom(selection, animate = true) {
        let scaleTransform;
        let translateTransform;
        let svgSelection = d3.select(this.element);
        let boardSelection = svgSelection.select('[type="Board"]');
        let boundingBox = selection.node().getBBox();
        let hideSelection;
        let showSelection;
        if (selection.attr('type') === 'Board') {
            if (this.focusedSelection && this.focusedSelection.attr('type') === 'SeatingAreaExpose') {
                hideSelection = this.focusedSelection;
            }
            else {
                hideSelection = svgSelection.selectAll('[type="SeatingAreaExpose"]');
            }
            showSelection = svgSelection.selectAll('[type="SeatingArea"],[type="Stage"]');
        }
        else if (selection.attr('type') === 'SeatingAreaExpose') {
            hideSelection = svgSelection.selectAll('[type="SeatingArea"],[type="Stage"]');
            showSelection = selection;
        }
        let parentWidth = this.element.clientWidth;
        let parentHeight = this.element.clientHeight;
        let desiredWidth = parentWidth - this.margin * 2;
        let desiredHeight = parentHeight - this.margin * 2;
        let widthRatio = desiredWidth / boundingBox.width;
        let heightRatio = desiredHeight / boundingBox.height;
        let ratio = Math.min(widthRatio, heightRatio);
        scaleTransform = `scale(${ratio})`;
        let newX = (this.element.clientWidth / 2 - boundingBox.width * ratio / 2 - boundingBox.x * ratio);
        let newY = (this.element.clientHeight / 2 - boundingBox.height * ratio / 2 - boundingBox.y * ratio);
        translateTransform = `translate(${newX},${newY})`;
        let currentTransform = selection.attr('transform');
        if (!currentTransform) {
            currentTransform = 'translate(0, 0)scale(1)';
        }
        if (hideSelection) {
            hideSelection
                .style('opacity', 1)
                .transition()
                .duration(animate ? 300 : 0)
                .style('opacity', 0)
                .on('end', () => {
                hideSelection.style('pointer-events', 'none');
            });
        }
        if (showSelection) {
            showSelection.transition()
                .style('opacity', 0)
                .duration(animate ? 300 : 0)
                .style('opacity', 1)
                .on('end', () => {
                showSelection.style('pointer-events', 'inherit');
            });
        }
        boardSelection.transition()
            .duration(animate ? 300 : 0)
            .attr('transform', `${translateTransform}${scaleTransform}`);
        this.focusedSelection = selection;
    }
    refresh() {
        this.zoom(this.focusedSelection);
    }
    bindEvents() {
        let svgSelection = d3.select(this.element);
        let selection = svgSelection.selectAll('[type="SeatingArea"]');
        selection.on('click', (d) => {
            let ele = d3.event.srcElement;
            let expose = ele.getAttribute('expose');
            if (expose) {
                this.zoom(svgSelection.select(`[name="${expose}"]`));
            }
        });
    }
    static attach(element) {
        let d3s = new D3SeatingChart(element);
        d3s.init();
        return d3s;
    }
}
exports.D3SeatingChart = D3SeatingChart;


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const D3SeatingChart_1 = __webpack_require__(0);
__export(__webpack_require__(0));
let d3sc = D3SeatingChart_1.D3SeatingChart.attach(document.getElementById('x'));
d3sc.getSeats().on('click', function () {
    let ele = this;
    if (ele.classList.contains('reserved')) {
        return;
    }
    if (ele.classList.contains('active')) {
        ele.classList.remove('active');
    }
    else {
        ele.classList.add('active');
    }
});
document.getElementById('goToBoard').onclick = function () {
    d3sc.goToBoard();
};


/***/ })
],[2]);