 function search(categories, string){
    let url =  'http://localhost:8000/';
    fetch(url + categories).then(response=>response.json().then((data)=>{
        data.forEach(element => {
            if(element.name.toLowerCase().includes(string)){
                fetch(url + 'artists').then(response=>response.json().then((names)=>{
                    names.forEach(name=>{
                        if(element.artist_id == name.id){
                            $data = name.name + ' ' + element.name;
                            console.log($data);
                        }
                    }) 
                    
                    //document.getElementById("al").innerHTML= $data;

                }))
            }
        });
    }));
}

