var Helper = {
  toScreenPosition: function(vector, camera) {

        var widthHalf = 0.5*renderer.context.canvas.width;
        var heightHalf = 0.5*renderer.context.canvas.height;

        vector.project(camera);

        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;

        return { 
            x: vector.x,
            y: vector.y
        };
    }
}

export default Helper;