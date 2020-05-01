$('#div-chat').hide();

const socket =io('https://stream105.herokuapp.com/');
$('#div-chat').hide();
socket.on('DANH_SACH_ONLINE',userInfo =>{
    $('#div-chat').show();
    $('#div-dangKy').hide();
    userInfo.forEach(user => {
        const { ten, peerId} = user;
        $('#ulUser').append(`<li id="${peerId}" >ds${ten}</li>`);
    });
    socket.on('CO_NGUOI_DUNG_MOI',user=>{
        const { ten, peerId} = user;
        $('#ulUser').append(`<li id="${peerId}" >${ten}</li>`);

    });
    socket.on('AI_DO_NGAT_KET_NOI',peerId =>{
        $(`#${peerId}`).remove();
    });
});

socket.on('DANG_KY_THAT_BAI',()=>alert('Vui long chon username khac! '));
//open stream 
function openStream(){
    const contraints = { audio:true, video:true};
   return  navigator.mediaDevices.getUserMedia(contraints);
}

function playStream(idVideo,stream){
    const video =document.getElementById(idVideo);
    video.srcObject =stream;
    video.play();
}
/*
openStream()
.then(stream =>playStream('localStream',stream));
*/
const  peer = new Peer();
peer.on('open', id =>{
    $('#my-peer').append(id);
    $('#btnSignUp').click(()=>{
        const username = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KY',{ten: username, peerId: id });
    });
});

//caller
$('#btnCall').click(() =>{
    const id =$('#remoteId').val();
    openStream()
    .then(stream => {
        playStream('localStream',stream);
        const call =peer.call(id,stream);
        call.on('stream', remoteStream =>playStream('remoteStream',remoteStream));
    });
});

peer.on('call', call =>{
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream',stream);
        call.on('stream', remoteStream =>playStream('remoteStream',remoteStream));
    });
});

$('#ulUser').on('click','li',function(){
    const id = $(this).attr('id') ;
    openStream()
    .then(stream => {
        playStream('localStream',stream);
        const call =peer.call(id,stream);
        call.on('stream', remoteStream =>playStream('remoteStream',remoteStream));
    });
});