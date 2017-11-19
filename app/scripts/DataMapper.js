class DataMapper {
	static adaptData() {
        var data = [];
        for(var i = 0; i < datas.length; i++) {
            if(datas[i][2] == 1) {
                data.push(datas[i]);
            }
            if(datas[i][2] == 0) {
                console.log(datas[i]);
            }
        }
        for(var i=0; i<data.length; i++){
            datas.push([ data[i][0], data[i][1], 0 ])
        }
    }
}

export default DataMapper