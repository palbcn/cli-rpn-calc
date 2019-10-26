#!/usr/bin/env node
/*

RPN calculator
PAL Barcelona. 2018 <palbcn@yahoo.com>

 */
(function rcNS(){

	let  help = () => console.log(`

	RPN Calculator 
	by PAL Barcelona. <palbcn@yahoo.com>

		rpncalc [--options] [operands operators]

		options
			--help 
			--debug 
			--fullstack  return full stack 

		operands
			any number f.ex. 9.99
			or in hexadecimal 0x99
			or in scientific notation 9e99

		two-operand math operators
			'+' '-' '*' '/': arithmetic add, sub, mul, div
			'%': modulo
			'^' 'p': power
			'v': root 
			
		single-operand math operators 
			'f': floor
			'r': round
			'n': negative, chs, -x
			'i': inverse, 1/x
			'a': abs
			'l': ln
			'e': exp
			's': sin 
			'c': cos   
			't': arcTan

		no-operand operators
			'P': pi, π 
			'E': e
			'A': aleatory, random
		
		stack manipulation  
			'x': exchange x<->y
			'=': duplicate x, enter
			'S': store y in x 
			'R': recall from x 
	`);

	/** 
		parses an arguments list (like the obtained with process.argv)
		into an options object (that begin with --) and a parameters array.
		
		example: 
		"--verbose --inputfile:calcs.txt 90 180 / P * "
		returns { 
			parms: [ '90','180','/','P','*' ],
			opts:  { inputfile: "calcs.txt", verbose: true } 
		} 
	*/
	function commandLine(argv = null) {
		let ao = argv || process.argv.slice(2);
		let parms = ao.filter(a => !a.startsWith('--'));
		let opts = ao
			.filter(a => a.startsWith('--'))
			.map(a => a.replace(/^-+/, '').split(/[:=]/))
			.reduce((a, e, i) => {
				a[e[0]] = e[1] || true;
				return a;
			}, {});
		let cli = { parms, opts };
		return cli;
	} 

	// https://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	/* simple display functions */
	function showValue(v,i) {
		console.log(i, v || '0');
	}

	function showStack(stack) {
		stack.map(showValue);
	}

	/**
	 * 
	 * the reverse polish notation calculator 
	 * 
	 * @param {string or array of strings} opers operands and operators, if is an string, it is split first.
	 * @param {object} options { debug, help, fullStack }
	 * @returns {number or array of numbers} the result or the results stack 
	 * 
	 */
	function rpn( opers, options = {}) {
    /* opers should be an array of strings, if not and is an string, split it first */
		if (typeof opers === 'string') opers = opers.split(' ');

		/* primitive function for two-operand operations  */
		function op2(op, a, b) {
			switch (op) {
				case '+':
					return a + b;
				case '-':
					return a - b;
				case '*':
					return a * b;
				case '/':
					return a / b;
				case '%':
					return a % b;
				case 'p':
				case '^':
					return Math.pow(a, b);
				case 'v':
					return Math.pow(a, 1 / b);
				case 'S':
					store[b]=a;
					return a;
				default:
					throw ('internal error, operator ' + op);
			}
		}
		/* primitive function for one-operand operations  */
		function op1(op, a) {
			switch (op) {
				case 'f':
					return Math.floor(a);
				case 'r':
					return Math.round(a);
				case 'n':
					return -a;
				case 'i':
					return 1 / a;
				case 'a':
					return Math.abs(a);
				case 'l':
					return Math.log(a);
				case 'e':
					return Math.exp(a);
				case 's':
					return Math.sin(a);
				case 'c':
					return Math.cos(a);
				case 't':
					return Math.atan(a);
				case 'R':
					if (!store[a]) throw ('inexistent storage ' + a );
					return store[a];
				default:
					throw ('internal error, operator ' + op);
			}
		}

		/* the stack of operands, intermediate results and final results */
		let stack = [];
		/* the store of auxiliary values stored and recalled */
		let store = {};
		
		let cnt = 0;  //aux counter
		if (options.debug) console.log(0,JSON.stringify(opers));
		/* operators and operands loop */
		while (opers && opers.length) {
			let op = opers.shift();
			cnt++;
			
			/* if it's numeric, is an operand, push it into the stack */
			if (isNumeric(op)) {
				stack.push(Number(op));

			/* if it's a two-operand operator */
			} else if (['+', '-', '*', '/', '%', '^', 'v', 'p','S'].includes(op)) {			
				
				if (stack.length < 2)
					throw (op + " requires 2 operands");
				let b = stack.pop();
				let a = stack.pop();
				stack.push(op2(op, a, b));

			/* if it's a one-operand operator */
			} else if (['f', 'r', 'n', 'i', 'a', 'l', 'e', 's', 'c', 't', 'R'].includes(op)) {
				
				if (stack.length < 1)
					throw (op + " requires 1 operand");
				let a = stack.pop();
				stack.push(op1(op, a));
			
			/* if it's a non-operand operator */
			} else if (['P', 'E', 'A'].includes(op)) {
				if (op == 'P') {
					stack.push(Math.PI);
				} else if (op == 'E') {
					stack.push(Math.E);
				} else if (op == 'A') {
					stack.push(Math.random());
				}

			/* if it's an special operator: stack manipulation */
			} else if (op == 'x') {
				if (stack.length < 2)
				throw (op + " requires 2 operands");
				let b = stack.pop();
				let a = stack.pop();
				stack.push(b);
				stack.push(a);

			} else if (op == '=') {
				if (stack.length < 1)
					throw (op + " requires 1 operand");
				let a = stack.pop();
				stack.push(a);
				stack.push(a);

			} else {
				throw ('unknown operator ' + op);
			}
			if (options.debug) console.log(cnt, op, stack, store);

		}
		if (options.fullStack) return stack.reverse();
		else return stack.pop();
	}

	if (module.parent) {
		module.exports = rpn;

	} else {		
		(function main() {
			// process the command line arguments
			let cli = commandLine();	
			if ((cli.parms.length==0) || (cli.opts.help)) return help();

			// invoke the calculator
			let result = rpn(cli.parms,cli.opts);

			// and print the result
			if (cli.opts.debug) console.log('=====================');
			
			//if (cli.opts.fullStack) showStack(result) else 
			console.log(result);
			
		})();
	}

})();