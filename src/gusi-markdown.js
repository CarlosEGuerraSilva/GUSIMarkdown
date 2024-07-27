"use strict"

class GUSIMarkdown {
    //Regex to detect zero width characters
    REGEX_MATCH_ZEROWIDTHCHARS = /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/;
    //Regex to sanitize < (Tag open)
    REGEX_MATCH_OPENTAG = /(<)+/;
    //Regex to sanitize > (Close tag)
    REGEX_MATCH_CLOSETAG = /(>)+/;
    //Title elements
    REGEX_H1 = /^(#){1}[^#]{1}[\S\s ]*/;
    REGEX_REPLACE_H1 = /^(#){1}/;
    REGEX_H2 = /^(##){1}[^#]{1}[\S\s ]*/;
    REGEX_REPLACE_H2 = /^(##){1}/;
    REGEX_H3 = /^(###){1}[^#]{1}[\S\s ]*/;
    REGEX_REPLACE_H3 = /^(###){1}/;
    REGEX_H4 = /^(####){1}[^#]{1}[\S\s ]*/;
    REGEX_REPLACE_H4 = /^(####){1}/;
    REGEX_H5 = /^(#####){1}[^#]{1}[\S\s ]*/;
    REGEX_REPLACE_H5 = /^(#####){1}/;
    REGEX_H6 = /^(######){1}[^#]{1}[\S\s ]*/;
    REGEX_REPLACE_H6 = /^(######){1}/;
    //LI elements
    REGEX_UL_LI = /^(-){1}[^#]{1}[\S\s ]*/;
    REGEX_REPLACE_UL_LI = /^(-){1}/
    //Regex to match *Bold* markdown
    REGEX_MARKDOWN_BOLD = /\*(.*?)\*/;
    //Regex to match _Italic_ markdown
    REGEX_MARKDOWN_ITALIC = /\_(.*?)\_/;
    //Regex to match (links)[#] markdown
    REGEX_MARKDOWN_LINK = /\((.*?)\)+\[(.*?)\]/;
    //Regex to match !@table@[,] markdown
    REGEX_MARKDOWN_TABLE = /^!(\@table\@)+(\[(.*?)\])+/;
    //Regex to match !@img@()[] markdown
    REGEX_MARKDOWN_IMG = /^!(\@img\@)+\((.*?)\)+\[(.*?)\]/;

    MARKDOWN_HORIZONTAL_RULE = "---"

    TEXT_FONT_FAMILY = "Arial";
    TEXT_COLOR = "black";
    IMG_STYLE = "";
    TABLE_CLASS = "";
    TABLE_STYLE = "";


    constructor(Options = {}) {
        if (Object.getOwnPropertyNames(Options).includes("fontFamily")) {
            this.TEXT_FONT_FAMILY = Object.getOwnPropertyDescriptor(Options, "fontFamily").value;
        }
        if (Object.getOwnPropertyNames(Options).includes("imgStyle")) {
            this.IMG_STYLE = Object.getOwnPropertyDescriptor(Options, "imgStyle").value;
        }
        if (Object.getOwnPropertyNames(Options).includes("tableStyle")) {
            this.TABLE_STYLE = Object.getOwnPropertyDescriptor(Options, "tableStyle").value;
        }
        if (Object.getOwnPropertyNames(Options).includes("tableClass")) {
            this.TABLE_CLASS = Object.getOwnPropertyDescriptor(Options, "tableClass").value;
        }
        if (Object.getOwnPropertyNames(Options).includes("color")) {
            this.TEXT_COLOR = Object.getOwnPropertyDescriptor(Options, "color").value;
        }
    }


    /**
     * Process the whole line to get the element
     * @param {string} str The line string
     */
    getLineElement(str) {
        //If the element has own childrens instead text (like table element)
        //this will prevent replace all elements by setting innerHTML
        let hasOwnChildrens = false;
        //Remove zero width characters
        let content = str.replace(this.REGEX_MATCH_ZEROWIDTHCHARS, "");
        let LineElement;
        //Replace <
        while (content.match(this.REGEX_MATCH_OPENTAG)) {
            content = content.replace(this.REGEX_MATCH_OPENTAG, '&lt;');
        }
        //Replace >
        while (content.match(this.REGEX_MATCH_OPENTAG)) {
            content = content.replace(this.REGEX_MATCH_OPENTAG, '&gt;');
        }
        //Format lines by its comodin
        if (content.match(this.REGEX_H1)) {
            LineElement = document.createElement('h1');
            content = content.replace(this.REGEX_REPLACE_H1, "");
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        } else if (content.match(this.REGEX_H2)) {
            LineElement = document.createElement('h2');
            content = content.replace(this.REGEX_REPLACE_H2, "");
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        } else if (content.match(this.REGEX_H3)) {
            LineElement = document.createElement('h3');
            content = content.replace(this.REGEX_REPLACE_H3, "");
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        } else if (content.match(this.REGEX_H4)) {
            LineElement = document.createElement('h4');
            content = content.replace(this.REGEX_REPLACE_H4, "");
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        } else if (content.match(this.REGEX_H5)) {
            LineElement = document.createElement('h5');
            content = content.replace(this.REGEX_REPLACE_H5, "");
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        } else if (content.match(this.REGEX_H6)) {
            LineElement = document.createElement('h6');
            content = content.replace(this.REGEX_REPLACE_H6, "");
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        } else if (content == this.MARKDOWN_HORIZONTAL_RULE) {
            LineElement = document.createElement('hr');
            content = "";
        } else if (content.match(this.REGEX_UL_LI)) {
            LineElement = document.createElement('li');
            content = content.replace(this.REGEX_REPLACE_UL_LI, "");
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        } else if (content.match(this.REGEX_MARKDOWN_TABLE)) {
            //Special format for table
            //rows are separated by | comodins
            //and columns by |!|
            //Creation of the table element
            LineElement = document.createElement('table');
            //For use in the first row as a thead
            let isTHEAD = true;
            //Blank table content
            let Element_THEAD = document.createElement('thead');
            let Element_TBODY = document.createElement('tbody');
            //Get rows inside !@table@[]
            let TableContent = content.match(this.REGEX_MARKDOWN_TABLE)[2];
            TableContent = TableContent.substring(1, TableContent.length - 1);
            //Split rows by |!| comodin
            TableContent.split('|!|').forEach(tableRow => {
                //If its first row is thead, else is tbody row
                if (isTHEAD) {
                    isTHEAD = false;
                    let Element_THEAD_TR = document.createElement('tr');
                    tableRow.split('|').forEach(thElement => {
                        let Element_TR_TD = document.createElement('th');
                        Element_TR_TD.scope = "col";
                        Element_TR_TD.textContent = thElement;
                        Element_THEAD_TR.appendChild(Element_TR_TD);
                    });
                    Element_THEAD.appendChild(Element_THEAD_TR);
                } else {
                    let Element_TBODY_TR = document.createElement('tr');
                    tableRow.split('|').forEach(tdElement => {
                        let Element_TR_TD = document.createElement('td');
                        Element_TR_TD.scope = "col";
                        Element_TR_TD.textContent = tdElement;
                        Element_TBODY_TR.appendChild(Element_TR_TD);
                    });
                    Element_TBODY.appendChild(Element_TBODY_TR);
                }
            });
            LineElement.appendChild(Element_THEAD);
            LineElement.appendChild(Element_TBODY);
            //Add table attributes
            LineElement.className = this.TABLE_CLASS;
            LineElement.style = this.TABLE_STYLE;
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
            //Setting own elements to prevent content replacing
            hasOwnChildrens = true;
        } else if (content.match(this.REGEX_MARKDOWN_IMG)) {
            //Special format for img element
            LineElement = document.createElement('img');
            LineElement.className = "img-fluid";
            LineElement.src = content.match(this.REGEX_MARKDOWN_IMG)[3];
            LineElement.alt = content.match(this.REGEX_MARKDOWN_IMG)[2];
            content = content.replace(this.REGEX_MARKDOWN_IMG, "");
            LineElement.style = this.IMG_STYLE;
        } else if (content.length == 0) {
            LineElement = document.createElement('br');
            content = "";
        } else {
            LineElement = document.createElement('p');
            LineElement.style.color = this.TEXT_COLOR;
            LineElement.style.fontFamily = this.TEXT_FONT_FAMILY;
        }
        //Format the *bold* text
        while (content.match(this.REGEX_MARKDOWN_BOLD)) {
            content = content.replace(this.REGEX_MARKDOWN_BOLD, "<strong>" + content.match(this.REGEX_MARKDOWN_BOLD)[1] + "</strong>");
        }
        //Format the _italic_ text
        while (content.match(this.REGEX_MARKDOWN_ITALIC)) {
            content = content.replace(this.REGEX_MARKDOWN_ITALIC, "<i>" + content.match(this.REGEX_MARKDOWN_ITALIC)[1] + "</i>");
        }
        //Format hyperlinks
        while (content.match(this.REGEX_MARKDOWN_LINK)) {
            content = content.replace(this.REGEX_MARKDOWN_LINK, '<a href="' + content.match(this.REGEX_MARKDOWN_LINK)[4] + '">' + content.match(this.REGEX_MARKDOWN_LINK)[2] + '</a>');
        }
        if (!hasOwnChildrens) {
            LineElement.innerHTML = content;
        }
        return LineElement;
    }

    /**
     * Process the full string to get all lines (including whitespaces) to get all markdowns
     * @param {string} str The full string to get all markdown content
     * return an array containing all the elements
     */
    getMarkdownElements(str) {
        let elements = [];
        str.split('\n').forEach(line => {
            elements.push(this.getLineElement(line));
        });
        return elements;
    }

    /**
     * Process the full string to get all lines (including whitespaces) to get all markdowns
     * and then add all the elements to the container
     * @param {string} str The full string to get all markdown content
     * @param {string} target The container target to be filled with the markdown elements
     * @param {boolean} clearContainerBefore If true will remove all container childs before gets filled
     */
    populateElementContent(str, target, clearContainerBefore = true) {
        //If clearContainerBefore true then all the nodes of the specified container will be removed
        if (clearContainerBefore) {
            //Recursive delete of the child nodes of the container
            while (document.querySelector(target).firstChild) {
                document.querySelector(target).removeChild(document.querySelector(target).lastChild)
            }
        }
        //Initialize element array
        const Lines = this.getMarkdownElements(str);
        //Process the elements which can be nested on a parent element, like ul>li
        Lines.forEach(function (element, index) {
            let HasPrevius = index > 0;
            let HasNext = index < Lines.length - 1;
            let PreviusElement = HasPrevius ? Lines[index - 1] : null;
            let NextElement = HasNext ? Lines[index + 1] : null;
            if (element.tagName.toLowerCase() == 'li') {
                if (PreviusElement) {
                    if (PreviusElement.tagName.toLowerCase() != 'ul') {
                        let ULElement = document.createElement('ul');
                        Lines.splice(index, 1, ULElement);
                        ULElement.appendChild(element);
                    } else {
                        PreviusElement.append(element);
                        Lines.splice(index, 1, PreviusElement);
                    }
                } else {
                    let ULElement = document.createElement('ul');
                    Lines.splice(index, 1, ULElement);
                    ULElement.appendChild(element);
                }
            }
        });
        //Once the elements where processed and nested then we can populate the specified container
        Lines.forEach(element => {
            document.querySelector(target).appendChild(element);
        });
    }

    listen(elementListener, targetSelector, clearContainerBefore = true, events = []){
        let editorElement = document.querySelector(elementListener);
        let targetElement = document.querySelector(targetSelector);
        if (editorElement && targetElement) {
            events.forEach(elementEvent => {
                editorElement.addEventListener(elementEvent, ()=>{
                    this.populateElementContent(editorElement.value, targetSelector, clearContainerBefore)
                });
            });
        } else {
            console.error("An element with the specified selector was not found.", editorElement, targetElement)
        }
    }

    isValidURL(url){
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    isExternalURL(url){
        if (!this.isValidURL(url)) {
            return false;
        } else {
            let varUrl = new URL(url);
            return varUrl.hostname != window.location.hostname;
        }
    }
}