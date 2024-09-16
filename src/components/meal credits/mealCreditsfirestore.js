const form = document.querySelector('form name'); //your form name
function renderDoc(doc){
    // deleting data
    cross.addEventListener('click',(e)=>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Collection name').doc(id).delete();//write your collection name
    })
}
// getting data
db.collection('Collection name').get().then((snapshot)=>{
    snapshot.docs.forEach(doc => {
        renderCafe(doc);
    })
})

// saving data

form.addEventListener('submit',(e) =>{
    e.preventDefault();
    db.collection('Collection name').add({
        //values that you want to add
    })
    //set values to null afterwards
})