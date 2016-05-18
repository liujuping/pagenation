/**
 * Created by wangtingdong on 16/5/17.
 */
var pagination=(function() {
    function pagination(pageCount,id) {
        var boxNode=document.createElement('div'),
            width=document.getElementById(id).offsetWidth;
        //设置宽度，方便取得显示的数目；
        if(pageCount>1) {
            boxNode = getPaginationNode(pageCount);
            //添加事件
            addPageChangeEvent(boxNode,width);
        }
        return boxNode;
    }

    //对控件添加默认的事件
    function addPageChangeEvent(element,width) {
        var pageNum = 0,
            pageNodes = element.querySelectorAll('.page-item'),
            beforePageBtn = element.querySelector('.page-before');
        /*
         * 设置初始样式,默认选中第一页
         * 这里只设置上一页的样式，因为下一页用相邻选择器设置了样式
         */
        pageNodes[pageNum].setAttribute('data-status', 'select');
        beforePageBtn.setAttribute('data-status', 'prevent');
        setShowPage(pageNum, pageNodes,width);

        element.onclick = function (e) {
            var target = e.target || e.srcElement;

            //清除之前的样式
            pageNodes[pageNum].removeAttribute('data-status', 'select');
            beforePageBtn.removeAttribute('data-status');

            //根据点击内容设置当前选中节点
            switch (target.className) {
                case 'page-before':
                    pageNum ? pageNum-- : '';
                    break;
                case 'page-item':
                    pageNum = getIndex(target, pageNodes);
                    break;
                case  'page-next':
                    pageNum < pageNodes.length - 1 ? pageNum++ : '';
                    break;
            }
            //设置当前样式
            pageNodes[pageNum].setAttribute('data-status', 'select');
            !pageNum ? beforePageBtn.setAttribute('data-status', 'prevent') : '';
            setShowPage(pageNum, pageNodes,width);
        };

        //IE and chrome 阻止双击选中文本
        element.onselectstart = function () {
            return false
        };
    }

    //获取node在nodeList中的索引
    function getIndex(node, nodeList) {
        for (var i = 0; i < nodeList.length; i++) {
            if (node == nodeList[i]) {
                return i;
            }
        }
        return -1;
    }

    //dom节点内容的生成
    function getPaginationNode(pageCount) {
        var pageText = '', boxNode;
        boxNode = document.createElement('div');
        boxNode.id = 'pagination';
        boxNode.className = 'pagination';

        pageText += '<span class="page-before">《</span>';
        for (var i = 0; i < pageCount; i++) {
            /*
             * 在page－item 节点第二和倒数第二个节点插入一个span节点
             * 用css选择器控制其显示与隐藏
             */
            pageText += i === 2 || i === pageCount - 1 ? '<span class="hide-icon">...</span>' : '';
            pageText += '<div class="page-item">' + (i + 1) + '</div>';
        }
        pageText += '<span class="page-next">》</span>';
        boxNode.innerHTML = pageText;
        return boxNode;
    }

    //根据当前选中节点，控制显示和隐藏的节点
    function setShowPage(index, nodeList,width) {
        //设置能显示的数目
        var maxShowNum=0;
        //显示所有节点
        for (var i = 0; i < nodeList.length; i++) {
            nodeList[i].removeAttribute('data-hide');
        }
        maxShowNum=parseInt(width/140);
        switch (true) {
            case width<420:
                maxShowNum=3;
                break;
            case width<640:
                maxShowNum=4;
                break;
            case width<980:
                maxShowNum=5;
                break;
            default :
                maxShowNum=6;
                break;
        }

        switch (true) {
            case index <= maxShowNum/2:
                hidePagination(nodeList, maxShowNum, nodeList.length - 1);
                break;
            case index >= nodeList.length - maxShowNum/2:
                hidePagination(nodeList, 1, nodeList.length - maxShowNum);
                break;
            case index > maxShowNum/2 && index < nodeList.length - maxShowNum/2:
                hidePagination(nodeList, 1, parseInt(index - maxShowNum/2+1));
                hidePagination(nodeList, parseInt(index + maxShowNum/2+1), nodeList.length - 1);
                break
        }
    }

    //隐藏 nodeList 中 start 到 end 索引的节点
    function hidePagination(nodeList, start, end) {
        var i = 0;
        for (i = start; i < end; i++) {
            nodeList[i].setAttribute('data-hide', 'hide');
        }
    }

    return pagination;
})();
