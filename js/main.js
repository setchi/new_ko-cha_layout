$(function () {

	const situationsEnum = {
		LEFT: 0,
		RIGHT: 1,
		TOP: 2,
		BOTTOM: 3,
		FULLSCREEN: 4
	};


	var currentSituation = situationsEnum.FULLSCREEN;


	var calcMarkPosition = function (rectSize, rectOffset, posInsideRect) {
		rectSize = $.extend(true, {}, rectSize);
		rectOffset = $.extend(true, {}, rectOffset);
		posInsideRect = $.extend(true, {}, posInsideRect);

		const xThreshold = rectSize.width * 0.3;
		const yThreshold = rectSize.height * 0.4;

		// situation judgement
		if (posInsideRect.x < xThreshold) {
			currentSituation = situationsEnum.LEFT;
			rectSize.width /= 2;

		} else if (posInsideRect.x > rectSize.width - xThreshold) {
			currentSituation = situationsEnum.RIGHT;
			rectSize.width /= 2;
			rectOffset.left += rectSize.width;

		} else if (posInsideRect.y < yThreshold) {
			currentSituation = situationsEnum.TOP;
			rectSize.height /= 2;

		} else if (posInsideRect.y > rectSize.height - yThreshold) {
			currentSituation = situationsEnum.BOTTOM;
			rectSize.height /= 2;
			rectOffset.top += rectSize.height;

		} else {
			currentSituation = situationsEnum.FULLSCREEN;
		}

		return {
			top: rectOffset.top,
			left: rectOffset.left,
			width: rectSize.width,
			height: rectSize.height
		};
	}


	var setMarkPosition = (function () {
		var $mark = $('.mark');
		var positionCache = { top: 0, left: 0, width: 0, height: 0 };

		return function (position) {

			if (positionCache.top === position.top &&
				positionCache.left === position.left &&
				positionCache.width === position.width &&
				positionCache.height === position.height) {
				return;
			}
			positionCache = position;
			$mark.css(positionCache);
		}
	}());


	var onClickHandler = function (e) {
		var html = "";

		switch (currentSituation) {

			case situationsEnum.LEFT:
			case situationsEnum.RIGHT:
				html = '<div class="rect vertical"></div><div class="rect vertical"></div>';
				break;

			case situationsEnum.TOP:
			case situationsEnum.BOTTOM:
				html = '<div class="rect horizontal"></div><div class="rect horizontal"></div>';
				break;

			case situationsEnum.FULLSCREEN:
				html = '';
				break;
		}

		$(e.target).html(html);
	};


	var onMouseMoveHandler = (function () {
		var $rect = [];
		var rectOffset = {
			top: 0,
			left: 0
		};
		var rectSize = {
			width: 0,
			height: 0
		};

		return function (e) {
			if ($rect[0] !== e.target) {
				$rect = $(e.target);

				rectOffset = $rect.offset();
				rectSize = {
					width: $rect.width(),
					height: $rect.height()
				}

				$('.rect').removeClass('painted');
				$rect.addClass('painted');
			}

			var posInsideRect = {
				x: e.pageX - rectOffset.left,
				y: e.pageY - rectOffset.top
			};

			if (posInsideRect.x < 0 || posInsideRect.y < 0) {
				return;
			}

			setMarkPosition(calcMarkPosition(
				rectSize,
				rectOffset,
				posInsideRect
			));
		}
	}());


	var onContextMenuHandler = function (e) {
		var $parentRect = $(e.target).parent();

		if (!$parentRect.hasClass('rect')) {
			$parentRect = $(e.target);
		}

		var $childrenClone = $parentRect.find('>').children().clone();
		$parentRect.empty().append($childrenClone);

		e.preventDefault();
	};


	$(document)
		.on('contextmenu', '.rect', onContextMenuHandler)
		.on('mousemove', '.rect', onMouseMoveHandler)
		.on('click', '.rect', onClickHandler);
});
