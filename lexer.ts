import * as fs from 'fs/promises';

export enum TokenType {
    Number,
    Identifier,
    Equals,
    OpenParen,
    CloseParen,
    BinaryOperator,
    Let,
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
};

export interface Token {
    type: TokenType;
    value: string;
}

function token(value = "", type: TokenType): Token {
    return { value, type };
}

function isalpha(src: string) {
    return src.match(/^[a-zA-Z]+$/) != null;
}

function isskip(src: string) {
    return src.match(/^[ \t\n]+$/) != null;
}

function isdigit(src: string) {
    return src.match(/^[0-9]+$/) != null;
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");

    while (src.length > 0) {
        if (src[0] == "(") {
            tokens.push(token(src.shift()!, TokenType.OpenParen));
        } else if (src[0] == ")") {
            tokens.push(token(src.shift()!, TokenType.CloseParen));
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/") {
            tokens.push(token(src.shift()!, TokenType.BinaryOperator));
        } else if (src[0] == "=") {
            tokens.push(token(src.shift()!, TokenType.Equals));
        } else {
            // multi-char tokens
            if (isdigit(src[0])) {
                let num = "";
                while (src.length > 0 && isdigit(src[0])) {
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number));
            } else if (isalpha(src[0])) {
                let ident = "";
                while (src.length > 0 && (isalpha(src[0]) || isdigit(src[0]))) {
                    ident += src.shift();
                }
                const keyword = KEYWORDS[ident];
                if (keyword) {
                    tokens.push(token(ident, keyword));
                } else {
                    tokens.push(token(ident, TokenType.Identifier));
                }
            } else if (isskip(src[0])) {
                src.shift(); // Skip curr char
            } else {
                console.log("Unexpected character: ", src[0]);
                break;
            }
        }
    }

    return tokens;
}

async function main() {
    try {
        const source = await fs.readFile("test.txt", "utf-8");
        for (const token of tokenize(source)) {
            console.log(token);
        }
    } catch (err) {
        console.error("Error reading file:", err);
    }
}

main();
