import customTypesControllers, {
    interfaces
} from "../customTypesControllers";

/**  
* Bu fonksiyon bir array içerisindeki belli typeların (["section1", "section2"]) controlled data içerisinde var olup olmadığını kontrol etmek için kullanılır.
* @example 
* customTypesControllers([
*    {
*      types: ["section1", "section2"]
*      controlledData: "section1",
*      errorPropName: "test"
*    },
*    {
*      types: ["section3", "section4"]
*      controlledData: "section4",
*      errorPropName: "test2"
*    }
* ])
**/
const multipleCustomTypesControllers = async (args = [interfaces]) => {
    return await new Promise((resolve, reject) => {
        let resolveObject = {};

        /* All Types controll */
        args.forEach(async (element, index) => {
            /* Controll */
            const customControllers = await customTypesControllers(element);
            if (!customControllers.status) {
                resolveObject = customControllers
            }

            /* End of function controllers */
            if (index + 1 === args.length) {
                if (Object.keys(resolveObject).length !== 0) {
                    resolve(resolveObject)
                }
                else {
                    resolve({
                        status: true,
                        message: "Başarılı"
                    });
                }
            }
        });
    });
};

export default multipleCustomTypesControllers;