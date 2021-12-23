const {sendMail,sendMailContact} = require("../Common/Mailer");
const { HTTP_STATUS_CODE } = require("../Common/Constants");

const sendContact = async (body)=>{
    try{
        let{fromEmail, fromPass, content, phone } = body;
        const emailFeedBackBody = "Cảm ơn bạn đạ phản hồi về dịch vụ của chúng tôi, chúng tôi sẽ liên hệ để giải đáp thắc mắc của bạn ngay";
        const sendContent = "Câu hỏi: "+ content +". Từ " + phone;
        console.log(body);
        const send = await sendMailContact(fromEmail,fromPass,"Thư thắc mắc", sendContent, );
       const Mail =  await sendMail(fromEmail,"Thư trả lời", emailFeedBackBody);
       return{
        success:true,
        data:"",
        message:{
            ENG:"send mail contact successfully",
            VN:"Gửi mail phản hồi thành công"
        },
        statusCode: HTTP_STATUS_CODE.OK,
    };
      
        
    }catch(error){
        return {
            message: {
                ENG:error.message,
                VN:"Gửi mail thất bại"
            },
            success: false,
            status: error.status,
          };
    }
    
}

module.exports = {sendContact}