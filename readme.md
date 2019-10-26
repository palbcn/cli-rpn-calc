# RPN command-line calculator
A Reverse Polish Notation calculator for the command line 

# installation

    npm --global install cli-rpn-calc

# usage

simply try it out

    $ node cli-rpm-calc 5 4 3 2 * * *
    > 120
   

and

    $node cli-rmp-calc   

will show this help information

      node cli-rpm-calc [--options] [operands operators]
      
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
        

