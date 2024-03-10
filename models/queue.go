package models

type Queue []interface{}

func (q *Queue) Enqueue(v interface{}) {
	*q = append(*q, v)
}

func (q *Queue) Dequeue() interface{} {
	if len(*q) == 0 {
		return nil
	}

	v := (*q)[0]
	*q = (*q)[1:]
	return v
}
