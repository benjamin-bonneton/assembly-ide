DEFINE max_value 3
LDI r1 max_value
LDI r2 0

.loop
CMP r1 r2
BRH EQ .end
INC r2
JMP .loop

.end
HLT