import numpy as np
import matplotlib.pyplot as plt; plt.close('all')
import networkx as nx
from matplotlib.animation import FuncAnimation

def animate_nodes(G, node_colors, pos=None, *args, **kwargs):

    # define graph layout if None given
    if pos is None:
        pos = nx.spring_layout(G, seed=2)

    # draw graph
    nodes = nx.draw_networkx_nodes(G, pos, node_size=100, *args, **kwargs)
    edges = nx.draw_networkx_edges(G, pos, edge_color="#c9c9c9", width=0.5, alpha=0.3, *args, **kwargs)
    plt.axis('off')

    def update(ii):
        # nodes are just markers returned by plt.scatter;
        # node color can hence be changed in the same way like marker colors
        nodes.set_array(node_colors[ii])
        return nodes,

    fig = plt.gcf()
    animation = FuncAnimation(fig, update, interval=1, frames=len(node_colors), blit=True)
    return animation



# current mobile bkg:
# total_nodes = 20
# graph = nx.random_geometric_graph(total_nodes, 0.45, seed=702)

# testing
total_nodes = 30
# graph = nx.random_geometric_graph(total_nodes, 0.4, seed=896803)
graph = nx.random_geometric_graph(total_nodes, 0.5, seed=5)

# plt.rcParams["figure.figsize"] = [15, 7]
# time_steps = 20
time_steps = 1
node_colors = np.random.randint(0, 1000, size=(time_steps, total_nodes))


animation = animate_nodes(graph, node_colors)
animation.save('test_static.gif', writer='imagemagick', savefig_kwargs={'facecolor':'#777'}, fps=0.75, dpi=300)