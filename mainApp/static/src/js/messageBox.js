export class Message
{
    constructor(message, type)
    {
        this.parentElement = document.getElementById('content');
        this.message = message;
        this.type = {
            error : '/static/img/error.png',
            success : '/static/img/success.png'
        };
        this.msgType = type === 'error' ? this.type.error : this.type.success;


        this.diplay = this.create();
    };

    create()
    {
        let fragment = document.createDocumentFragment();

        this.delete();
        const messageBox = document.createElement('div');
        messageBox.className = 'msgBox';
        const messageBox_img = document.createElement('img');
        messageBox_img.className = 'msgBox-img';
        messageBox_img.setAttribute('src', this.msgType);
        console.log(this.msgType)
        const messageBox_message = document.createElement('p');
        messageBox_message.className = 'msgBox-msg';
        messageBox_message.textContent = this.message;

        [messageBox_img, messageBox_message].forEach((item)=>{
            messageBox.append(item);
        });

        fragment.append(messageBox);

        this.parentElement.append(fragment);
    };

    delete()
    {
        if (this.parentElement.querySelector('.msgBox'))
            this.parentElement.querySelector('.msgBox').remove();
        else console.log('i can not found')
    };
}