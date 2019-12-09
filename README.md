# [https://quoteme.github.io/nDrender/](nDrender) #

A simple yet fully functional n-D renderer.
---
nDrender simply does what you want from it and nohing more or less.
Write a .json file that contains all the coordinates for all the verticies of
your shape and connect these verticies with faces inside your .json file.
After you have successfully created a n-Dimensional object, simply load it
with the nDrenderer written by my, Luca Leon Happel and see the magic happen.

This project aims to create a very simple n-dimensional object&vertex&face viewer.
Simplicity and ease of use are the top priority (after getting the engine to work.
So, if you plan to visualize your data in n-Dimensions or you just want to create
a fun n-Dimensional game, this library is for you. A wiki is soon to come.

![Demo image](demo.gif)
![Demo image](demo2.gif)
![Demo image](demo_voxel.gif)

### key bindings:

**Key**|**Action**
:-----:|:-----:
a|move negative to the current move dimension
d|move positive to the current move dimension
w|change the move dimension to a higher dimension
s|change the move dimension to a lower dimension
h|rotate negative to the currently selected rotation dimensions
l|rotate positive to the currently selected rotation dimensions
u|move to a higher first rotation dimension
j|move to a lower first rotation dimension
i|move to a higher second rotation dimension
k|move to a lower second rotation dimension
y|toggle wireframe
x|toggle drawing faces
c|decrease face opacity
v|increase face opacity
r|increase rotation x-origin
f|decrease rotation x-origin
t|increase rotation y-origin
g|decrease rotation y-origin

### .json file format:
Name|Type|Value
:--:|:--:|:---:
name|`string`|name of the model
dime|`int`|number of basis vectors needed / number of dimensions
rota|`nCr(dime,2)*[int]`|rotations between the axis
posi|`dime*[int]`|position of the object in space
scle|`dime*[int]`|scale of each basis vector
vert|`{string: dime*[int]}`|pairs of vertecies in space with their name
face|`{string: 4*[vert]}`|pairs of names with 4 touples of vertecy names
mate|`{string: {cface:#xxxxxx, cwire:#yyyyyy}}`|pairs of face names with their material data (cface is the face color and cwire is the border color)
