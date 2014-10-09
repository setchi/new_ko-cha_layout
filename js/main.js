$(function () {
	var state = 0;

	function onMouseMove(pageX, pageY, targetRoot) {
		var $targetRoot = $(targetRoot);
		$targetRoot.addClass('painted');

		var rootOffset = $targetRoot.offset();
		var localPos = {
			x: pageX - rootOffset.left,
			y: pageY - rootOffset.top
		}

		var targetWidth = $targetRoot.width();
		var targetHeight = $targetRoot.height();
		var wThreshold = 0.3;
		var hThreshold = 0.4;

		if (localPos.x < 0 || localPos.y < 0) {
			return;
		}

		// left
		if (localPos.x < targetWidth * wThreshold) {
			state = 0;
			targetWidth >>= 1;

		// right
		} else if (localPos.x > targetWidth - targetWidth * wThreshold) {
			state = 1;
			targetWidth >>= 1;
			rootOffset.left += targetWidth;

		// top
		} else if (localPos.y < targetHeight * hThreshold) {
			state = 2;
			targetHeight >>= 1;

		// bottom
		} else if (localPos.y > targetHeight - targetHeight * hThreshold) {
			state = 3;
			targetHeight >>= 1;
			rootOffset.top += targetHeight;

		} else {
			state = 4;
		}

		frameMoveTo({
			top: rootOffset.top,
			left: rootOffset.left,
			width: targetWidth,
			height: targetHeight
		});
	}

	var $frame = $('.frame');
	var currentFramePos = { top: 0, left: 0, width: 0, height: 0 };

	function frameMoveTo(pos) {
		if (currentFramePos.top === pos.top &&
			currentFramePos.left === pos.left &&
			currentFramePos.width === pos.width &&
			currentFramePos.height === pos.height) {
			return;
		}

		currentFramePos = pos;
		$frame.css(currentFramePos);
	}

	function getHtmlByState(state) {
		switch (state) {
		case 0:
		case 1:
			return '<div class="ct vertical"></div><div class="ct vertical"></div>';
		case 2:
		case 3:
			return '<div class="ct horizontal"></div><div class="ct horizontal"></div>';
		default:
			return '';
		}
	}

	$(document).on('mousemove', '.ct', function (e) {
		$('.ct').removeClass('painted');
		onMouseMove(e.pageX, e.pageY, e.target);

	}).on('click', '.ct', function (e) {
		$(e.target).html(getHtmlByState(state));

	}).on('contextmenu', '.ct', function (e) {
		var $parent = $(e.target).parent();

		if (!$parent.hasClass('ct')) {
			$parent = $(e.target);
		}

		var $childClone = $parent.find('>').children().clone();
		$parent.empty().append($childClone);

		e.preventDefault();

	});
});