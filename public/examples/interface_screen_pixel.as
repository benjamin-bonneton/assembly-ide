LDI r2 240

LDI r1 1         	  // X = 15
STR r2 r1           // Définir X

LDI r1 1           	// Y = 10
STR r2 r1 1         // Définir Y

STR r2 r0 2         // Dessiner dans le buffer

LOD r2 r5 4         // Obtenir la valeur du pixel

STR r2 r0 5         // Afficher le buffer à l'écran

STR r2 r0 3         // Vider un pixel

STR r2 r0 5         // Afficher le buffer à l'écran

STR r2 r0 2         // Dessiner dans le buffer

STR r2 r0 5         // Afficher le buffer à l'écran

STR r2 r0 6 		    // Vider le buffer

STR r2 r0 5         // Afficher le buffer à l'écran

HLT