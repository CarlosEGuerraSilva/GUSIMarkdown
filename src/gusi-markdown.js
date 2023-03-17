"use strict"

class GUSIMarkdown {
    //Regex to get all text including line breaks
    REGEX_MATCH_EVERYTHING = /(?=\n)/m;
    //Regex to detect zero width characters
    REGEX_MATCH_ZEROWIDTHCHARS = /^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/;
    //Regex to sanitize < (Tag open)
    REGEX_MATCH_OPENTAG = /(<)+/;
    //Regex to sanitize > (Close tag)
    REGEX_MATCH_CLOSETAG = /(>)+/;
    //Regex to remove line breaks
    REGEX_MATCH_LINEBREAK = /(\r\n|\n|\r)/g;
    //Regex to detect <br> at start of the line
    REGEX_MARCH_BRSTART = /^(<br>){1}[\S\s]*/;
    //Title elements
    REGEX_H1 = /^(#){1}[^#]{1}[\S\s]*/;
    REGEX_REPLACE_H1 = /^(#){1}/;
    REGEX_H2 = /^(##){1}[^#]{1}[\S\s]*/;
    REGEX_REPLACE_H2 = /^(##){1}/;
    REGEX_H3 = /^(###){1}[^#]{1}[\S\s]*/;
    REGEX_REPLACE_H3 = /^(###){1}/;
    REGEX_H4 = /^(####){1}[^#]{1}[\S\s]*/;
    REGEX_REPLACE_H4 = /^(####){1}/;
    REGEX_H5 = /^(#####){1}[^#]{1}[\S\s]*/;
    REGEX_REPLACE_H5 = /^(#####){1}/;
    REGEX_H6 = /^(######){1}[^#]{1}[\S\s]*/;
    REGEX_REPLACE_H6 = /^(######){1}/;
    //LI elements
    REGEX_UL_LI = /^(-){1}[^#]{1}[\S\s]*/;
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


    /**
     * Process the whole line to get the element
     * @param {string} str The line string
     */
    getLineElement(str) {
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
        //Change \n to <br> tags
        content = content.replaceAll(this.REGEX_MATCH_LINEBREAK, "<br>");
        //Remove initial <br> and add to end of line
        if (content.match(this.REGEX_MARCH_BRSTART)) {
            content = content.substr(content.indexOf("<br>") + 4) + '<br>';
        }
        //Format lines by its comodin
        if (content.match(this.REGEX_H1)) {
            LineElement = document.createElement('h1');
            content = content.replace(this.REGEX_REPLACE_H1, "");
        } else if (content.match(this.REGEX_H2)) {
            LineElement = document.createElement('h2');
            content = content.replace(this.REGEX_REPLACE_H2, "");
        } else if (content.match(this.REGEX_H3)) {
            LineElement = document.createElement('h3');
            content = content.replace(this.REGEX_REPLACE_H3, "");
        } else if (content.match(this.REGEX_H4)) {
            LineElement = document.createElement('h4');
            content = content.replace(this.REGEX_REPLACE_H4, "");
        } else if (content.match(this.REGEX_H5)) {
            LineElement = document.createElement('h5');
            content = content.replace(this.REGEX_REPLACE_H5, "");
        } else if (content.match(this.REGEX_H6)) {
            LineElement = document.createElement('h6');
            content = content.replace(this.REGEX_REPLACE_H6, "");
        } else if (content.match(this.REGEX_UL_LI)) {
            LineElement = document.createElement('li');
            content = content.replace(this.REGEX_REPLACE_UL_LI, "");
        } else if (content.match(this.REGEX_MARKDOWN_TABLE)) {
            //Special format for table
            //rows are separated by | comodins
            //and columns by comma ,
            //Creation of the table element
            LineElement = document.createElement('table');
            //Add table classname
            LineElement.className = "table table-bordered"
            //For use in the first row as a thead
            let isTHEAD = true;
            //Blank table content
            let theadContent = '';
            let tbodyContent = '';
            //Get rows inside !@table@[!!!]
            let TableContent = content.match(this.REGEX_MARKDOWN_TABLE)[2];
            TableContent = TableContent.substr(1, TableContent.length - 2);
            //Split rows by , comodin
            TableContent.split(',').forEach(tableRow => {
                //If its first row is thead, else is tbody row
                if (isTHEAD) {
                    isTHEAD = false;
                    theadContent = '<thead><tr>';
                    tableRow.split('|').forEach(thElement => {
                        theadContent += '<th scolpe="col">' + thElement + '</th>';
                    });
                    theadContent += '</tr></thead>';
                } else {
                    tbodyContent += '<tr>';
                    tableRow.split('|').forEach(tdElement => {
                        tbodyContent += '<td>' + tdElement + '</td>';
                    });
                    tbodyContent += '</tr>';
                }
            });
            content = content.replace(this.REGEX_MARKDOWN_TABLE, theadContent + '<tbody>' + tbodyContent + '</tbody>');
        } else if (content.match(this.REGEX_MARKDOWN_IMG)) {
            //Special format for img element
            LineElement = document.createElement('img');
            LineElement.className = "img-fluid";
            LineElement.src = content.match(this.REGEX_MARKDOWN_IMG)[3];
            LineElement.alt = content.match(this.REGEX_MARKDOWN_IMG)[2];
            content = content.replace(this.REGEX_MARKDOWN_IMG, "");
        } else {
            LineElement = document.createElement('span');
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
            console.log(content.match(this.REGEX_MARKDOWN_LINK));
            content = content.replace(this.REGEX_MARKDOWN_LINK, '<a href="' + content.match(this.REGEX_MARKDOWN_LINK)[4] + '">' + content.match(this.REGEX_MARKDOWN_LINK)[2] + '</a>');
        }
        LineElement.innerHTML = content;
        return LineElement;
    }

    /**
     * Process the full string to get all lines (including whitespaces) to get all markdowns
     * @param {string} str The full string to get all markdown content
     * return an array containing all the elements
     */
    getMarkdownElements(str) {
        let elements = [];
        str.split(this.REGEX_MATCH_EVERYTHING).forEach(line => {
            elements.push(this.getLineElement(line));
        });
        return elements;
    }

    /**
     * Process the full string to get all lines (including whitespaces) to get all markdowns
     * and then add all the elements to the container
     * @param {string} str The full string to get all markdown content
     * @param {string} selector The container selector
     * @param {boolean} clearContainerBefore If true will remove all container childs before gets filled
     */
    populateElementContent(str, selector, clearContainerBefore = true) {
        if (clearContainerBefore) {
            while (document.querySelector(selector).firstChild) {
                document.querySelector(selector).removeChild(document.querySelector(selector).lastChild)
            }
        }
        str.split(this.REGEX_MATCH_EVERYTHING).forEach(line => {
            document.querySelector(selector).appendChild(this.getLineElement(line));
        });
    }
}