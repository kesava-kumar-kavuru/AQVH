import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function QuantumCircuit() {
  return (
    <Card className="quantum-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-quantum-pulse"></div>
          Variational Quantum Classifier (VQC)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quantum Circuit Visualization */}
          <div className="bg-muted/20 rounded-lg p-4 border border-primary/20">
            <div className="space-y-3">
              {/* Qubit lines */}
              {[0, 1, 2, 3].map((qubit) => (
                <div key={qubit} className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground w-6">|{qubit}⟩</span>
                  <div className="flex-1 h-px bg-primary/40 relative">
                    {/* Quantum gates */}
                    <div className="absolute top-1/2 left-8 -translate-y-1/2 w-6 h-6 bg-secondary rounded border-2 border-secondary-foreground flex items-center justify-center text-xs font-bold">
                      H
                    </div>
                    <div className="absolute top-1/2 left-20 -translate-y-1/2 w-6 h-6 bg-primary rounded border-2 border-primary-foreground flex items-center justify-center text-xs font-bold">
                      R
                    </div>
                    <div className="absolute top-1/2 left-32 -translate-y-1/2 w-6 h-6 bg-accent/20 rounded border-2 border-accent flex items-center justify-center text-xs font-bold">
                      M
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Circuit Parameters */}
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Depth</div>
              <div className="font-semibold text-primary">4</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Parameters</div>
              <div className="font-semibold text-secondary">16</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Qubits</div>
              <div className="font-semibold text-accent">4</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}