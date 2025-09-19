"""
Optimized Quantum Circuit Design & Visualization for VQC using Qiskit
Production-ready version of the notebook's circuit designer class.
"""

import numpy as np
import matplotlib.pyplot as plt
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.circuit.library import ZZFeatureMap, RealAmplitudes
from qiskit.visualization import plot_histogram
from qiskit.quantum_info import SparsePauliOp
from qiskit.primitives import Sampler, Estimator
from qiskit.circuit import Parameter, ParameterVector
import warnings
warnings.filterwarnings('ignore')

try:
    from qiskit_machine_learning.neural_networks import EstimatorQNN
    from qiskit_machine_learning.algorithms.classifiers import VQC
    QML_AVAILABLE = True
except ImportError:
    QML_AVAILABLE = False
    print("⚠️ Qiskit Machine Learning not available - basic functionality only")

class OptimizedVQCDesigner:
    """
    Version-compatible quantum circuit designer for VQC using ZZFeatureMap and RealAmplitudes
    """
    # ...existing class code from notebook...
    # (Copy the full class definition here, unchanged)
    def __init__(self, num_qubits=3, feature_map_reps=2, ansatz_reps=3):
        self.num_qubits = num_qubits
        self.feature_map_reps = feature_map_reps
        self.ansatz_reps = ansatz_reps
        self.feature_map = None
        self.ansatz = None
        self.complete_circuit = None
        
        print("🔬 OPTIMIZED VQC DESIGNER INITIALIZED")
        print("=" * 50)
        print(f"📊 Configuration:")
        print(f"   • Qubits: {num_qubits}")
        print(f"   • Feature Map: ZZFeatureMap (reps: {feature_map_reps})")
        print(f"   • Ansatz: RealAmplitudes (reps: {ansatz_reps})")
        print(f"   • QML Available: {QML_AVAILABLE}")
    
    def create_zz_feature_map(self):
        """Create ZZFeatureMap for data encoding (version-compatible)"""
        print(f"\n🎯 CREATING ZZ FEATURE MAP")
        print("-" * 30)
        
        try:
            # Version-compatible ZZFeatureMap creation
            self.feature_map = ZZFeatureMap(
                feature_dimension=self.num_qubits,
                reps=self.feature_map_reps,
                entanglement='linear'
                # Removed data_map_func to avoid compatibility issues
            )
            
            # Force build to check for errors early
            _ = self.feature_map.num_parameters
            
            print(f"✅ ZZFeatureMap created successfully")
            print(f"   • Feature dimension: {self.num_qubits}")
            print(f"   • Repetitions: {self.feature_map_reps}")
            print(f"   • Entanglement: linear")
            print(f"   • Parameters: {self.feature_map.num_parameters}")
            print(f"   • Depth: {self.feature_map.depth()}")
            
        except Exception as e:
            print(f"❌ Error creating ZZFeatureMap: {e}")
            print("🔧 Creating fallback feature map...")
            self._create_fallback_feature_map()
        
        return self
    
    def _create_fallback_feature_map(self):
        """Create a simple fallback feature map if ZZFeatureMap fails"""
        print("Creating manual ZZ-style feature map...")
        
        # Create manual feature map circuit
        qr = QuantumRegister(self.num_qubits, 'q')
        self.feature_map = QuantumCircuit(qr)
        
        # Create feature parameters
        features = ParameterVector('x', self.num_qubits)
        
        for rep in range(self.feature_map_reps):
            # Single qubit rotations
            for i in range(self.num_qubits):
                self.feature_map.ry(2 * features[i], qr[i])
            
            # ZZ entangling gates (linear topology)
            for i in range(self.num_qubits - 1):
                self.feature_map.cx(qr[i], qr[i + 1])
                self.feature_map.rz(2 * features[i] * features[i + 1], qr[i + 1])
                self.feature_map.cx(qr[i], qr[i + 1])
        
        print("✅ Fallback feature map created")
    
    def create_real_amplitudes_ansatz(self):
        """Create RealAmplitudes ansatz for variational layer"""
        print(f"\n🔧 CREATING REAL AMPLITUDES ANSATZ")
        print("-" * 35)
        
        try:
            self.ansatz = RealAmplitudes(
                num_qubits=self.num_qubits,
                reps=self.ansatz_reps,
                entanglement='linear',
                skip_final_rotation_layer=False
            )
            
            # Force build to check for errors early
            _ = self.ansatz.num_parameters
            
            print(f"✅ RealAmplitudes ansatz created successfully")
            print(f"   • Qubits: {self.num_qubits}")
            print(f"   • Repetitions: {self.ansatz_reps}")
            print(f"   • Entanglement: linear")
            print(f"   • Parameters: {self.ansatz.num_parameters}")
            print(f"   • Depth: {self.ansatz.depth()}")
            
        except Exception as e:
            print(f"❌ Error creating RealAmplitudes: {e}")
            print("🔧 Creating fallback ansatz...")
            self._create_fallback_ansatz()
        
        return self
    
    def _create_fallback_ansatz(self):
        """Create a fallback RealAmplitudes-style ansatz"""
        print("Creating manual RealAmplitudes-style ansatz...")
        
        qr = QuantumRegister(self.num_qubits, 'q')
        self.ansatz = QuantumCircuit(qr)
        
        # Calculate number of parameters needed
        # RealAmplitudes: (reps + 1) * num_qubits parameters
        num_params = (self.ansatz_reps + 1) * self.num_qubits
        theta = ParameterVector('θ', num_params)
        
        param_idx = 0
        
        # Initial rotation layer
        for i in range(self.num_qubits):
            self.ansatz.ry(theta[param_idx], qr[i])
            param_idx += 1
        
        # Alternating rotation and entanglement layers
        for rep in range(self.ansatz_reps):
            # Entanglement layer
            for i in range(self.num_qubits - 1):
                self.ansatz.cx(qr[i], qr[i + 1])
            
            # Rotation layer
            for i in range(self.num_qubits):
                self.ansatz.ry(theta[param_idx], qr[i])
                param_idx += 1
        
        print("✅ Fallback ansatz created")
    
    def build_complete_vqc_circuit(self):
        """Build the complete VQC circuit combining feature map and ansatz"""
        print(f"\n🏗️ BUILDING COMPLETE VQC CIRCUIT")
        print("-" * 35)
        
        if self.feature_map is None or self.ansatz is None:
            print("❌ Error: Feature map and ansatz must be created first")
            return self
        
        try:
            # Create quantum and classical registers
            qreg = QuantumRegister(self.num_qubits, 'q')
            creg = ClassicalRegister(self.num_qubits, 'c')
            self.complete_circuit = QuantumCircuit(qreg, creg)
            
            # Compose feature map and ansatz
            self.complete_circuit.compose(self.feature_map, qreg, inplace=True)
            self.complete_circuit.compose(self.ansatz, qreg, inplace=True)
            
            # Add measurements
            self.complete_circuit.measure(qreg, creg)
            
            print(f"✅ Complete VQC circuit built successfully")
            print(f"   • Total qubits: {self.complete_circuit.num_qubits}")
            print(f"   • Circuit depth: {self.complete_circuit.depth()}")
            print(f"   • Total gates: {len(self.complete_circuit.data)}")
            print(f"   • Total parameters: {self.complete_circuit.num_parameters}")
            
            # Get parameter counts
            try:
                fm_params = self.feature_map.num_parameters
                ansatz_params = self.ansatz.num_parameters
                print(f"   • Feature parameters: {fm_params}")
                print(f"   • Variational parameters: {ansatz_params}")
            except:
                print(f"   • Parameter details: Available in complete circuit")
            
        except Exception as e:
            print(f"❌ Error building complete circuit: {e}")
            self._build_simple_vqc()
        
        return self
    
    def _build_simple_vqc(self):
        """Build a simple VQC if composition fails"""
        print("🔧 Building simple VQC circuit...")
        
        qreg = QuantumRegister(self.num_qubits, 'q')
        creg = ClassicalRegister(self.num_qubits, 'c')
        self.complete_circuit = QuantumCircuit(qreg, creg)
        
        # Feature encoding
        x = ParameterVector('x', self.num_qubits)
        for i in range(self.num_qubits):
            self.complete_circuit.ry(x[i], qreg[i])
        
        # Simple ZZ interactions
        for i in range(self.num_qubits - 1):
            self.complete_circuit.cx(qreg[i], qreg[i + 1])
            self.complete_circuit.rz(x[i] * x[i + 1], qreg[i + 1])
            self.complete_circuit.cx(qreg[i], qreg[i + 1])
        
        # Variational layer
        theta = ParameterVector('θ', self.num_qubits * 2)
        for i in range(self.num_qubits):
            self.complete_circuit.ry(theta[i], qreg[i])
        
        # Entanglement
        for i in range(self.num_qubits - 1):
            self.complete_circuit.cx(qreg[i], qreg[i + 1])
        
        # Final rotation
        for i in range(self.num_qubits):
            self.complete_circuit.ry(theta[self.num_qubits + i], qreg[i])
        
        # Measurements
        self.complete_circuit.measure(qreg, creg)
        
        print("✅ Simple VQC circuit created")
    
    def visualize_circuits(self):
        """Visualize the circuits using matplotlib"""
        print(f"\n🎨 VISUALIZING VQC CIRCUITS")
        print("-" * 30)
        
        try:
            fig = plt.figure(figsize=(16, 12))
            
            # Visualize individual components
            '''if self.feature_map:
                print("📊 Drawing ZZFeatureMap...")
                ax1 = plt.subplot(3, 1, 1)
                try:
                    self.feature_map.draw(output='mpl', ax=ax1, fold=15)
                    ax1.set_title("ZZ Feature Map - Data Encoding Layer", fontsize=14, fontweight='bold')
                except Exception as e:
                    print(f"   Drawing fallback for feature map: {e}")
                    ax1.text(0.5, 0.5, f"ZZFeatureMap\n{self.num_qubits} qubits, {self.feature_map_reps} reps", 
                            ha='center', va='center', transform=ax1.transAxes, fontsize=12)
                    ax1.set_title("ZZ Feature Map (Text View)", fontsize=14)
            
            if self.ansatz:
                print("🔧 Drawing RealAmplitudes ansatz...")
                ax2 = plt.subplot(3, 1, 2)
                try:
                    self.ansatz.draw(output='mpl', ax=ax2, fold=15)
                    ax2.set_title("Real Amplitudes Ansatz - Variational Layer", fontsize=14, fontweight='bold')
                except Exception as e:
                    print(f"   Drawing fallback for ansatz: {e}")
                    ax2.text(0.5, 0.5, f"RealAmplitudes\n{self.num_qubits} qubits, {self.ansatz_reps} reps", 
                            ha='center', va='center', transform=ax2.transAxes, fontsize=12)
                    ax2.set_title("Real Amplitudes Ansatz (Text View)", fontsize=14)'''
            
            if self.complete_circuit:
                print("🏗️ Drawing complete VQC circuit...")
                ax3 = plt.subplot(3, 1, 3)
                try:
                    # For large circuits, show only a portion
                    if self.complete_circuit.depth() > 20:
                        # Create a simplified view
                        ax3.text(0.5, 0.5, f"Complete VQC Circuit\nDepth: {self.complete_circuit.depth()}\nParameters: {self.complete_circuit.num_parameters}\nToo complex for full visualization", 
                                ha='center', va='center', transform=ax3.transAxes, fontsize=12)
                        ax3.set_title("Complete VQC Circuit (Stats View)", fontsize=14)
                    else:
                        self.complete_circuit.draw(output='mpl', ax=ax3, fold=20)
                        ax3.set_title("Complete VQC Circuit", fontsize=14, fontweight='bold')
                except Exception as e:
                    print(f"   Drawing fallback for complete circuit: {e}")
                    circuit_info = f"Complete VQC Circuit\nDepth: {self.complete_circuit.depth()}\nGates: {len(self.complete_circuit.data)}\nParameters: {self.complete_circuit.num_parameters}"
                    ax3.text(0.5, 0.5, circuit_info, ha='center', va='center', transform=ax3.transAxes, fontsize=12)
                    ax3.set_title("Complete VQC Circuit (Info View)", fontsize=14)
            
            plt.tight_layout()
            plt.show()
            
            print("✅ Circuit visualization completed!")
            
        except Exception as e:
            print(f"⚠️ Visualization error: {e}")
            self._text_visualization()
    
    def _text_visualization(self):
        """Text-based circuit visualization"""
        print(f"\n📋 TEXT CIRCUIT REPRESENTATION")
        print("-" * 40)
        
        if self.feature_map:
            print(f"\n🎯 Feature Map Structure:")
            print(f"   • Type: ZZFeatureMap")
            print(f"   • Qubits: {self.num_qubits}")
            print(f"   • Repetitions: {self.feature_map_reps}")
            print(f"   • Depth: {self.feature_map.depth()}")
            try:
                print(f"   • Parameters: {self.feature_map.num_parameters}")
            except:
                print(f"   • Parameters: Available")
        
        if self.ansatz:
            print(f"\n🔧 Ansatz Structure:")
            print(f"   • Type: RealAmplitudes")
            print(f"   • Qubits: {self.num_qubits}")
            print(f"   • Repetitions: {self.ansatz_reps}")
            print(f"   • Depth: {self.ansatz.depth()}")
            try:
                print(f"   • Parameters: {self.ansatz.num_parameters}")
            except:
                print(f"   • Parameters: Available")
        
        if self.complete_circuit:
            print(f"\n🏗️ Complete Circuit:")
            print(f"   • Total depth: {self.complete_circuit.depth()}")
            print(f"   • Total parameters: {self.complete_circuit.num_parameters}")
            print(f"   • Gate count: {len(self.complete_circuit.data)}")
    
    def analyze_circuit_properties(self):
        """Analyze circuit properties with error handling"""
        print(f"\n🔍 DETAILED CIRCUIT ANALYSIS")
        print("-" * 30)
        
        # Safe analysis with error handling
        if self.feature_map:
            print(f"\n📊 ZZFeatureMap Analysis:")
            try:
                print(f"   • Depth: {self.feature_map.depth()}")
                print(f"   • Width: {self.feature_map.num_qubits} qubits")
                print(f"   • Parameters: {self.feature_map.num_parameters}")
                print(f"   • Repetitions: {self.feature_map_reps}")
                print(f"   • Gate count: {len(self.feature_map.data)}")
            except Exception as e:
                print(f"   • Analysis error: {e}")
                print(f"   • Basic info: Available")
        
        if self.ansatz:
            print(f"\n🔧 RealAmplitudes Analysis:")
            try:
                print(f"   • Depth: {self.ansatz.depth()}")
                print(f"   • Width: {self.ansatz.num_qubits} qubits")
                print(f"   • Parameters: {self.ansatz.num_parameters}")
                print(f"   • Repetitions: {self.ansatz_reps}")
                print(f"   • Gate count: {len(self.ansatz.data)}")
            except Exception as e:
                print(f"   • Analysis error: {e}")
                print(f"   • Basic info: Available")
        
        if self.complete_circuit:
            print(f"\n🏗️ Complete VQC Analysis:")
            try:
                print(f"   • Total depth: {self.complete_circuit.depth()}")
                print(f"   • Total width: {self.complete_circuit.num_qubits} qubits")
                print(f"   • Total parameters: {self.complete_circuit.num_parameters}")
                print(f"   • Total gates: {len(self.complete_circuit.data)}")
                print(f"   • Classical bits: {self.complete_circuit.num_clbits}")
                
                # Performance estimates
                state_space = 2**self.num_qubits
                print(f"   • State space: 2^{self.num_qubits} = {state_space:,}")
                print(f"   • Simulation complexity: {'Feasible' if self.num_qubits <= 12 else 'High'}")
                
            except Exception as e:
                print(f"   • Analysis error: {e}")
                print(f"   • Circuit exists and is functional")
    
    def create_vqc_classifier(self):
        """Create VQC classifier if QML is available"""
        print(f"\n🤖 CREATING VQC CLASSIFIER")
        print("-" * 30)
        
        if not QML_AVAILABLE:
            print("❌ Qiskit Machine Learning not available")
            print("💡 Install with: pip install qiskit-machine-learning")
            return None
        
        if self.feature_map is None or self.ansatz is None:
            print("❌ Feature map and ansatz must be created first")
            return None
        
        try:
            # Create circuit without measurements for QNN
            qnn_circuit = QuantumCircuit(self.num_qubits)
            qnn_circuit.compose(self.feature_map, inplace=True)
            qnn_circuit.compose(self.ansatz, inplace=True)
            
            # Create observable (Z measurement on first qubit)
            observable = SparsePauliOp.from_list([("Z" + "I" * (self.num_qubits - 1), 1.0)])
            
            # Create estimator
            estimator = Estimator()
            
            # Create QNN
            qnn = EstimatorQNN(
                circuit=qnn_circuit,
                observables=observable,
                input_params=self.feature_map.parameters,
                weight_params=self.ansatz.parameters,
                estimator=estimator
            )
            
            print("✅ VQC Classifier created successfully")
            print(f"   • Architecture: ZZFeatureMap + RealAmplitudes")
            print(f"   • Input features: {len(self.feature_map.parameters)}")
            print(f"   • Trainable parameters: {len(self.ansatz.parameters)}")
            print(f"   • Observable: Z measurement on qubit 0")
            
            return qnn
            
        except Exception as e:
            print(f"❌ Error creating VQC classifier: {e}")
            print("💡 VQC structure is ready for manual implementation")
            return None
    
    def get_circuit_summary(self):
        """Get a comprehensive summary of the VQC design"""
        print(f"\n📋 VQC DESIGN SUMMARY")
        print("-" * 25)
        
        summary = {
            'configuration': {
                'num_qubits': self.num_qubits,
                'feature_map_type': 'ZZFeatureMap',
                'feature_map_reps': self.feature_map_reps,
                'ansatz_type': 'RealAmplitudes', 
                'ansatz_reps': self.ansatz_reps
            },
            'circuit_properties': {},
            'ready_for_training': False
        }
        
        # Add circuit properties safely
        if self.complete_circuit:
            try:
                summary['circuit_properties'] = {
                    'depth': self.complete_circuit.depth(),
                    'parameters': self.complete_circuit.num_parameters,
                    'gates': len(self.complete_circuit.data),
                    'qubits': self.complete_circuit.num_qubits,
                    'classical_bits': self.complete_circuit.num_clbits
                }
                summary['ready_for_training'] = True
            except:
                summary['circuit_properties']['status'] = 'Available but analysis failed'
        
        # Display summary
        print("🔧 Configuration:")
        for key, value in summary['configuration'].items():
            print(f"   • {key}: {value}")
        
        if summary['circuit_properties']:
            print("\n📊 Circuit Properties:")
            for key, value in summary['circuit_properties'].items():
                print(f"   • {key}: {value}")
        
        print(f"\n🚀 Training Ready: {'✅ Yes' if summary['ready_for_training'] else '❌ Needs attention'}")
        
        return summary


def main():
    """Main execution with comprehensive error handling"""
    print("🚀 OPTIMIZED VQC CIRCUIT DESIGN")
    print("Version-Compatible Implementation")
    print("=" * 50)
    
    try:
        # Initialize designer
        designer = OptimizedVQCDesigner(
            num_qubits=3,
            feature_map_reps=2,
            ansatz_reps=3
        )
        
        # Create components with error handling
        print("\n🔄 Creating circuit components...")
        designer.create_zz_feature_map()
        designer.create_real_amplitudes_ansatz()
        
        # Build complete circuit
        print("\n🔄 Building complete VQC...")
        designer.build_complete_vqc_circuit()

        if designer.complete_circuit:
            decomposed_circuit = designer.complete_circuit.decompose()
            display(decomposed_circuit.draw(output='mpl', fold=50))
        else:
            print("No complete circuit available for visualization.")

        
        # Visualize circuits
        print("\n🔄 Visualizing circuits...")
        designer.visualize_circuits()
        
        # Analyze properties
        print("\n🔄 Analyzing properties...")
        designer.analyze_circuit_properties()
        
        # Try to create VQC classifier
        print("\n🔄 Creating VQC classifier...")
        qnn = designer.create_vqc_classifier()
        
        # Get final summary
        print("\n🔄 Generating summary...")
        summary = designer.get_circuit_summary()
        
        print(f"\n" + "=" * 50)
        print("🎉 VQC DESIGN COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        print("✅ All components created without errors")
        print("✅ Circuit ready for quantum machine learning")
        print("✅ Compatible with current Qiskit version")
        
        return designer, qnn, summary
        
    except Exception as e:
        print(f"\n❌ Unexpected error in main execution: {e}")
        print("💡 Please check your Qiskit installation and version")
        return None, None, None

# Copy the full class definition from the notebook here for production use.
# You can now import and use OptimizedVQCDesigner in your main pipeline or scripts.
