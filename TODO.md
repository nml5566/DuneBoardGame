Redraw promptTraitorSelect using canvas
=======================================
Move code into Animation/TraitorSelect.js

Draw troop movement
===================

Territory Selection
-------------------
isPointInPath() would make it easy to know if the mouse clicks inside of
territory boundaries. This requires cavas path drawing commands, so need an
image -> command converter.

Possibilities:
* http://stackoverflow.com/questions/2907537/is-there-a-way-to-convert-svg-files-to-html5s-canvas-compatible-commands
* https://code.google.com/p/lindenb/wiki/SVGToCanvas
