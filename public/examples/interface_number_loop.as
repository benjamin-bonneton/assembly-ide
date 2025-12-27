LDI r1 0				// Compteur initial
LDI r2 10       // Limite
LDI r3 250			// Fonction afficher numéro

.boucle
STR r3 r1 			// Afficher compteur
ADI r1 1       	// Incrémenter
CMP r2 r1      	// Comparer avec limite
BRH LT .boucle  // Si < 10, continuer

HLT