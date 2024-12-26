
export const REPORTS =[
    {
        id: Math.random(),
        reportName: "January Report",
        type: [".pdf",".doc",".docx"],
        content: "",
        dateOfCreation: new Date().getDate(),
        assignedTo: "",
        isEditable: false,
        isModified: {
            changed: false,
            isChanged: new Date().getTimezoneOffset(),
            modifieredText: ""
        },
        icons: [],
        generatedBy:"Auto",
        userRelated: "",
        password: ""
    },{
        id: Math.random()*10,
        reportName: "Feburary Report",
        type: [".pdf",".doc",".docx"],
        content: "",
        dateOfCreation: new Date().getDate(),
        assignedTo: "",
        isEditable: false,
        isModified: {
            changed: false,
            isChanged: new Date().getTimezoneOffset(),
            modifieredText: ""
        },
        icons: [],
        generatedBy:"Auto",
        userRelated: "",
        password: ""
    },{
        id: Math.random()*10,
        reportName: "March Report",
        type: [".pdf",".doc",".docx"],
        content: "",
        dateOfCreation: new Date().getDate(),
        assignedTo: "",
        isEditable: false,
        isModified: {
            changed: false,
            isChanged: new Date().getTimezoneOffset(),
            modifieredText: ""
        },
        icons: [],
        generatedBy:"Auto",
        userRelated: "",
        password: ""
    },

]