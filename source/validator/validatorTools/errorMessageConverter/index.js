const errorMessageConverter = (code, propsName) => {
    const errorMessages = [
        {
            /* Name */
            code: 1000,
            message: `${propsName} ler harflerden oluşabilir.`,
        },

        {
            /* User Name */
            code: 1001,
            message: `${propsName} larında sadece harfler, rakamlar, alt çizgiler ve noktalar kullanılabilir. `,
        },

        {
            /* Exist User Name */
            code: 1002,
            message: `Bu ${propsName} sistemimizde bulunmaktadır. `,
        },

        {
            /* Mail */
            code: 1003,
            message: `Lütfen geçerli bir ${propsName} giriniz. `,
        },
        {
            /* Exist Mail */
            code: 1004,
            message: `Bu ${propsName} sistemimizde bulunmaktadır. `,
        },

        {
            /* Phone Number */
            code: 1005,
            message: `Lütfen geçerli bir ${propsName} giriniz. `,
        },
        {
            /* Exist Phone Number */
            code: 1006,
            message: `Bu ${propsName} sistemimizde bulunmaktadır. `,
        },
        
        {
            /* Password */
            code: 1007,
            message: `${propsName} sadece MD5 formatında kabul edilir. `,
        },

        {
            /* Type Detector */
            code: 1008,
            message: `Lütfen bir ${propsName} giriniz. `,
        }
    ]

    return errorMessages.filter((item) => item.code === code)[0]
};

export default errorMessageConverter;