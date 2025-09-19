import matplotlib.pyplot as plt

def safe_plot(plot_func, title="Plot", figsize=(10, 6)):
    try:
        plt.figure(figsize=figsize)
        plot_func()
        plt.title(title)
        plt.tight_layout()
        plt.show()
        return True
    except Exception as e:
        print(f"Warning: Could not create {title}: {e}")
        return False